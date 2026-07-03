---
title: "LocalLLM: Running Qwen3.6-35B-A3B on an RTX 4070 Ti"
date: 2026-06-01T22:00:00+02:00
tags: ['ai', 'ollama', 'LM Studio', 'llama.cpp', 'omlx']
---

# tl;dr

See the final command at the end.

|                      |                                |
|----------------------|--------------------------------|
| CPU                  | AMD Ryzen 5950X                |
| GPU                  | NVIDIA RTX 4070 Ti, 12 GB VRAM |
| RAM                  | 64 GB DDR4 @ 2800 MHz          |
| Model                | Qwen3.6-35B-A3B                |
| Quantization         | IQ4_XS                         |
| Prompt processing    | ~800 tokens/second             |
| **Token generation** | ~60 tokens/second              |

# So far, my setup

I have experimented with local AI in 2023,
focusing on local execution, keeping all data private,
and not sending anything out to providers like OpenAI.

<https://github.com/stars/andreas-mausch/lists/ai>

- text-generation: <https://github.com/andreas-mausch/dockerize-ollama-mistral-7b-openorca>
- image-to-text: <https://github.com/andreas-mausch/dockerize-clip-interrogator>
- speech-to-text: <https://github.com/andreas-mausch/dockerize-whisper>
- object-detection: <https://github.com/andreas-mausch/dockerize-detr-resnet-50>

Now, a big step has been made with the new *Mixture-of-Experts* models,
and I was interested again to run it locally.

My gaming rig is not high-end, but it turned out to be decent enough to run
Qwen3.6 locally at very reasonable speed and quality.

# LM Studio

Because initially I didn't want to spend too much time
on this topic, I went with the easy, but non-FOSS solution
LM Studio.
And I have to say, it is really easy to use.

I just didn't know which models are the best currently,
so I did a little research and looked up the most popular ones.

I remember from the last experiments that anything above 9B parameters
wouldn't run well, so I started with these.

But eventually, I found Qwen3.6 and the internet was full of praise for it.

I learned that Qwen3.6-27B is the better model (despite the lower number 27B < 35B),
but I couldn't fit it into my VRAM, and it ran painfully slow on my CPU.

So I tried Qwen3.6-35B-A3B, and even the first try was really good.
I was impressed by the quality, and I could get around 20-25 tokens/second,
which is just enough to enjoy the experience in opencode.

I was a bit overwhelmed by all the settings and fine-tunings you can do.

When I did a bit too much playing with the settings, my model became unstable
and crashed or consumed all VRAM and became incredibly slow.

That's when I switched to llama.cpp, and that's what I recommend to anyone
who is familiar with the command line.

# MLX

For Mac users: There are MLX model variants, which are generated specifically
for Apple Silicon processors and are a bit faster than the GGUF variants.

Try them out.
I found them to be unstable in my setup with LM Studio (the models crashed from time to time),
but that might be on me and they are ~30% faster.

I also tried to use [oMLX](https://omlx.ai/), which is an alternative to LM Studio to run MLX models.
I didn't like the Web UI at all, though.
However, it was more stable.
And many people on the internet recommend it, so you might try it out.

# llama.cpp

llama.cpp is a bit more technical, but ran super stable for me.

Installation:
Download from here:
<https://github.com/ggml-org/llama.cpp/releases>

Important: To make CUDA work, you need two downloads.
At the time of writing, it was `cudart-llama-bin-win-cuda-13.3-x64.zip` and `llama-b9460-bin-win-cuda-13.3-x64.zip`.
Extract both into the same directory. I used `C:\Program Files\llama.cpp`.
This is for a setup with NVIDIA/CUDA of course, so your setup might vary here.
Oh, and while I mostly run Linux, my gaming rig is on Windows. So is the example here.

After some time, I understood some of the settings and found a setup which I enjoy
very much and would like to share with you.
I ended up getting around 60 tokens/second generation speed.

The most difficult part was:

1. to understand that the router has to run on the GPU to get a good performance
2. that the CPU is strong enough to run some of the experts,
   and that this will save you a lot of VRAM.

The exact model I use is `Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-IQ4_XS`.

IQ4_XS quants are decent enough for me, and quite fast.

I found that 24 experts (out of 40 maximum) on the CPU would give me best results,
in terms of VRAM usage and speed.
I just checked the VRAM usage in the Windows task manager, and just after loading the model,
I see around 10 out of 12 GB used. When it went above 11.5 GB, the model either
became painfully slow, or crashed.

For the context length: A higher value requires more VRAM, but a value <64k
wouldn't make working with opencode any fun.
As the context grows, the model becomes slower. And if it's getting close to the limit,
opencode has to compact the whole conversation, which takes a long time and sometimes
opencode forgets to continue after that.

I found 128k (= `131072`) to be the sweet spot for me.

Also, sometimes the model has to re-evaluate the whole context.
I'm not exactly sure whether I did something wrong with the cache settings,
or whether it's normal.
But when it happens, it takes quite a bit of time until the model responds to you at all
(for example: 100k context at 800 tokens/second prompt processing = 125 seconds).

Unsloth has a great website with howtos for a lot of models:
[Qwen3.6 - How to Run Locally](https://unsloth.ai/docs/models/qwen3.6)

# llama-ui

llama.cpp comes with a web UI, which offers basic features,
but lacks skills like webfetch.

I still like to use it for a basic, quick chat.

To disable thinking/reasoning mode, you can enter this under `Settings -> Developer`:

```json
{"chat_template_kwargs": {"enable_thinking": false}}
```

# Multi Token Prediction (MTP)

I only tested MTP briefly.
It wasn't much faster for me and uses more VRAM.

I think it's better for bigger models like the 27B.

# Experience in opencode

Cloud models are still far superior to everything I run on my own machine.
They are faster and produce better results.

But still, compared to my tests with LLMs three years ago, the gap is closing.

And it feels great to run this all on your own devices and not lose privacy.

For the quality: My model loops from time to time, and I have to stop it manually.
This is annoying, especially because it takes so much more time to get a good answer
to your problem and it spams your context.

I found it easier to give exact, small tasks to the AI, instead of one big task.
It requires more work on my part, because now I have to think and decide again
what's the best way to split up a problem into chunks.
But then again, I usually have a very specific idea of how my result should look.

# Final command

```bat{data-filename=qwen.cmd}
set model="C:\Users\neonew\.lmstudio\models\HauhauCS\Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive\Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-IQ4_XS.gguf"
"C:\Program Files\llama.cpp\llama-server.exe" --model %model% --flash-attn on --ctx-size 131072 --threads 16 --mmap --ubatch-size 1024 --batch-size 1024 --n-cpu-moe 24 --n-gpu-layers all --cache-type-k q8_0 --cache-type-v q8_0 --kv-unified --temperature 0.5 --top-k 20 --top-p 0.95 --min-p 0.00 --host 0.0.0.0 --port 1235 --parallel 1 --api-key api-key
```
