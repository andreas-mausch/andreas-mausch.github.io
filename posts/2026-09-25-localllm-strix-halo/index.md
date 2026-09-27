---
title: "LocalLLM: Running Qwen3.8-Flash-Next on Strix Halo (Asus ProArt PX13)"
date: 2026-09-25T22:00:00+02:00
tags: ['ai', 'gufo', 'llama.cpp', 'Strix Halo']
---

# tl;dr

See the final command at the end.

|                      |                                            |
|----------------------|--------------------------------------------|
| Laptop               | Asus ProArt PX13 (Strix Halo)              |
| CPU                  | AMD Ryzen AI MAX+ 395, 16 cores            |
| GPU                  | Radeon 8060S iGPU                          |
| RAM                  | 128 GB unified memory                      |
| OS                   | CachyOS, Linux 7.2.7                       |
| Model                | Qwen3.8-Flash-Next-125B-A6B                |
| Quantization         | UD-Q4_K_XL                                 |
| Context              | 256k                                       |
| Prompt processing    | ~900 tokens/second (AC) / ~500 (battery)   |
| **Token generation** | ~35 tokens/second (AC) / ~20 (battery)     |

In [my previous post]({% link-post "2026-06-01-localllm" %}), I ran a 35B Mixture-of-Experts
model on a 12 GB GPU, carefully moving experts to the CPU until the VRAM was full.
This time, there is no VRAM juggling at all:
a 125B model just fits into 128 GB of unified memory, and it is fast enough
to actually enjoy working with it.

# Why Strix Halo

The story so far: in 2023 I [experimented with local AI](https://github.com/stars/andreas-mausch/lists/ai),
in June 2026 I ran [Qwen3.6-35B-A3B on an RTX 4070 Ti]({% link-post "2026-06-01-localllm" %}),
and both times the bottleneck was memory: either VRAM or bandwidth.

AMD's Strix Halo (Ryzen AI Max) is the first mainstream chip that removes this
bottleneck: an iGPU with up to 128 GB of *unified* memory.
No more splitting experts between CPU and GPU, no more quantizing down
because the model doesn't fit. You just load the model and it's there.

So I got one: an Asus ProArt PX13 with 128 GB RAM, running CachyOS on Linux 7.2.7.
I paid 3.000 EUR for it (open box), regular price was 3.600 EUR and now it is not
even available anymore.

I also considered getting a Macbook Pro with an M5 Ultra and 128 GB, but Apple just raised
the prices from ~6.000 EUR to 7.800 EUR, so that was no option anymore.

I was also eyeing the GPD Win 5, but you could not order it in Germany with 128 GB.
And there was the Bosgame M5 mini PC, available for 2.500 EUR,
but for the small price difference I found a laptop the more attractive option.

# The model: Qwen3.8-Flash-Next-125B-A6B

The interesting part is not the hardware alone, it is the model generation.
Qwen3.8-Flash-Next is a Mixture-of-Experts model with 125B total parameters,
but only ~6B active parameters per token.

This combination suits Strix Halo well:

- 125B parameters at Q4 quantization need roughly 75-80 GB.
  No consumer GPU fits that today. 128 GB of unified memory do.
- Because only ~6B parameters are active per token,
  generation speed is limited by what you read per token, not what you store.
  That is manageable even on integrated graphics.

I use the Unsloth Dynamic quantization `UD-Q4_K_XL`,
which comes as four GGUF shards:

```
Qwen3.8-Flash-Next-UD-Q4_K_XL-00001-of-00004.gguf
```

It fits nicely into the 128 GB together with the 256k context,
the MTP model and the vision projector,
and in my usage the quality is good enough to not think about quantization at all.

# Serving with gufo in Docker

I serve the model with [gufo](https://github.com/gufo-org/gufo),
a local inference engine specifically optimized for Strix Halo,
in Docker. It provides an OpenAI-compatible API that I use from opencode.
The container talks to the AMD GPU via `/dev/kfd` and `/dev/dri`:

Two features are worth noting:

- **Speculative decoding via MTP** (`--speculative mtp`):
  the model ships a small "multi-token-prediction" head
  (I run it as a shared-expert variant in Q8_0).
  On the 35B in June this was not worth the VRAM, but here it is:
  gufo's [benchmarks](https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3.8-flash-next/BENCHMARKS.md)
  show ~26 tokens/second autoregressive vs. ~32 on mixed text and up to ~60 on repetitive text,
  which matches what I see on my machine.
- **Vision** (`--mmproj`):
  passing a multimodal projector lets the model see images,
  which opencode uses.
  I use the BF16 projector, because BF16 is preferred on modern hardware.
  I find the image recognition genuinely strong:
  far beyond the CLIP/BLIP models I used in 2023.

I switched engines more than once to get here.
When the model launched, llama.cpp did not support it at all,
so I used [a llama.cpp fork](https://github.com/apepojken/llama.cpp) by apepojken
that added support plus some RDNA 3.5 kernel work.
It served me well, but prompt processing stayed slow.
Then [halogen](https://github.com/peonist-ai/halogen-flash-server) came along,
and its prefill was blistering, but it is closed source.
gufo was the compromise I had been waiting for:
fast like halogen, but open source.
It advertises ~1.600 tokens/second prefill for this model on Strix Halo.
The [benchmarks](https://github.com/gufo-org/gufo/blob/main/docs/models/qwen3.8-flash-next/BENCHMARKS.md)
go into more detail than the numbers in this post,
with results per context length, and they match well what I see day to day.
My real-world numbers are lower than that benchmark,
but still 4-5x above apepojken's fork on the same machine:

| Prompt processing | apepojken's fork | gufo       |
| ----------------- | ---------------- | ---------- |
| Battery           | ~100 tok/s       | ~500 tok/s |
| Plugged in        | ~200 tok/s       | ~900 tok/s |

This matters a lot for agentic coding:
every tool call sends the whole conversation back to the model,
so a large part of your wall-clock time is spent re-processing the context.
At 200 tokens/second, a 100k context means an 8-minute stall.
At 900 tokens/second, the same re-evaluation takes under two minutes,
and with caching, only the incremental part has to be processed on most turns.

With 256k context and 8k max output tokens, there is plenty of room
for real coding sessions without constant compaction.

# Experience in opencode

This is where the "models got MUCH stronger" part comes in.

Last time, my honest conclusion was:
cloud models are still far superior, the model loops from time to time,
give it small tasks only.

This time, it is just fun.

I handed it a mid-sized Maven project, and it built it autonomously:
reading build errors, narrowing down the cause, fixing, rebuilding, repeat.
It found the critical points on its own, without me explaining
Maven's usual traps.

What changed compared to my June setup:

- **Quality**: fewer loops, fewer dead ends, better first guesses.
- **Autonomy**: I can hand it a bigger task and walk away.
- **Speed**: ~35 tokens/second generation is not the 60 of my desktop rig,
  but the 5x faster prompt processing, 256k context and the stronger model
  make the *workflow* feel faster, not slower.

# Not perfect yet: amdgpu crashes

To be honest: from time to time, the amdgpu driver crashed on me.
I don't know yet what triggers it. I have not found a reliable reproduction.
But Linux managed to recover the driver every time,
so I lost a running generation, not the machine.

This is the kind of rough edge you should expect when running
an iGPU at sustained full load on Linux. It did not stop me from enjoying the setup,
but if you want a turn-key experience, be aware of it.

<!-- TODO: if you find the cause later, update this section. -->

# Power profiles matter

Performance depends heavily on two things:

1. Whether the laptop is plugged in.
2. Which power profile is active.

Plugged in, on the normal profile, I get around 35 tokens/second on average,
and I have seen 40 in the best case.
On battery, in the same profile, generation drops to around 20 tokens/second,
and prompt processing from ~900 to ~500 tokens/second.

So if you benchmark a Strix Halo laptop and get disappointing numbers,
check the power profile first. Mine is a laptop, not a desktop replacement
that runs at full tilt all the time, and that is fine,
but you should know it when comparing tok/s figures from the internet.

# Not only for AI: a do-it-yourself Steam Machine

Strix Halo makes a fine gaming machine, too.
In my experience many games run well on the 8060S at 1080p,
and it competes well with Valve's new Steam Machine.
With one machine you can switch between a gaming session
and serving a local AI model: that beats two boxes under my desk.

# Outlook: audio, image, and video

What also appeals to me about gufo is the direction:
it wants to be a one-stop shop for local AI on this hardware.
Its model table already includes speech recognition (Qwen3-ASR)
and text-to-speech (Qwen3-TTS),
while image generation (Qwen-Image) and video generation (MiniMax H3)
are listed as in progress.

I recently played around with MiniMax H3 on my desktop and was impressed
by what it produced.
If it runs on the PX13 through the same tool one day,
I would have text, audio, image, and video generation in one place,
on my own hardware.

As far as I can tell, the video support today is text-to-video;
image-to-video driven by an additional text description
does not seem to be there yet. Something to watch.

# Comparison to the cloud

Cloud models are still ahead, but honestly:
for daily coding work, the gap no longer feels like a gap.
The model builds my Maven project, finds the real issues, and does not
need me to babysit it through every step.

And it runs entirely on my machine, on my desk, on battery,
with no prompt ever leaving the laptop.

Three years after my first local experiments, that used to be a compromise.
Now it is just a preference.

# Final command

```bash
docker run --rm \
  --user 1000:1000 \
  --group-add render \
  --device /dev/kfd \
  --device /dev/dri \
  --ulimit memlock=-1 \
  -p 8080:8080 \
  -v /srv/llama/models/Qwen3.8-Flash-Next-125B-A6B:/models/:ro \
  ghcr.io/gufo-org/toolboxes/gufo-runtime:20260924T104050 \
  gufo serve llm \
  --model /models/UD-Q4_K_XL/Qwen3.8-Flash-Next-UD-Q4_K_XL-00001-of-00004.gguf \
  --speculative mtp \
  --mtp-model /models/mtp-Qwen3.8-Flash-Next-shared-Q8_0.gguf \
  --mmproj /models/mmproj-BF16.gguf \
  --context 262144 \
  --max-tokens 8192 \
  --host 0.0.0.0 \
  --port 8080
```
