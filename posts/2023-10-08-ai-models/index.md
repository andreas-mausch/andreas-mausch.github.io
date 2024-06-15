---
title: "AI models"
date: 2023-10-08T23:00:00+02:00
tags: []
thumbnail: havanna-object-detection.jpg
---

# Text generation

UIs:

- ollama (CLI)
- GPT4All (GUI)
- serge (web)
- text-generation-webui (web)

Best models:

- TheBloke/Mistral-7B-OpenOrca-GGUF: Runs very fast on Mac M1 via text-generation-webui
- wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin (GPT4All): very good, supports LocalDocs
- Mistral (ollama): https://github.com/jmorganca/ollama, very fast and good on Mac M1, supports local files with some coding
- WizardLM-Uncensored-7B (serge): On Intel NUC

GitHub project: [https://github.com/andreas-mausch/dockerize-ollama-mistral-7b-openorca](https://github.com/andreas-mausch/dockerize-ollama-mistral-7b-openorca)

# Image generation

https://github.com/AUTOMATIC1111/stable-diffusion-webui

# Text-to-Speech

https://github.com/rsxdalv/tts-generation-webui

Best model: Bark

With audio/music generation included.

# Speech-to-text

GitHub project: [https://github.com/andreas-mausch/dockerize-whisper](https://github.com/andreas-mausch/dockerize-whisper)

# Image Captioning

BLIP2: Requires a short python code

Model: Salesforce/blip2-opt-2.7b

GitHub project: [https://github.com/andreas-mausch/dockerize-clip-interrogator](https://github.com/andreas-mausch/dockerize-clip-interrogator)

# Image object detection and classification

GitHub project: [https://github.com/andreas-mausch/dockerize-detr-resnet-50](https://github.com/andreas-mausch/dockerize-detr-resnet-50)

{% image "havanna-object-detection.jpg" %}

# Glossary

https://www.reddit.com/r/LargeLanguageModels/comments/13jvi7r/whats_the_difference_between_ggml_and_gptq_models/

- GPQT: best for CUDA
- GGML: best for CPU, but can also offload some layers on the GPU
- GGUP: Newer version of GGML, replacing it
