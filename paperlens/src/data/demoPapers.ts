import { PaperAnalysis } from '../types';

export const DEMO_PAPERS: PaperAnalysis[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: [
      'Ashish Vaswani',
      'Noam Shazeer',
      'Niki Parmar',
      'Jakob Uszkoreit',
      'Llion Jones',
      'Aidan N. Gomez',
      'Łukasz Kaiser',
      'Illia Polosukhin'
    ],
    year: '2017',
    venue: 'NeurIPS 2017 (31st Conference on Neural Information Processing Systems)',
    doi: '10.48550/arXiv.1706.03762',
    tldr: 'Introduces the Transformer, replacing recurrent and convolutional layers entirely with multi-head self-attention, achieving superior translation quality in a fraction of the training time.',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.',
    researchProblem: 'Sequential computation in recurrent networks (RNNs/LSTMs) prevents parallelization during training, and long-range dependencies require O(n) or O(log n) operations to connect distant positions, limiting scalability to long contexts.',
    researchObjectives: [
      'Eliminate recurrence and convolution in sequence-to-sequence translation',
      'Enable full parallelization across sequence length during training',
      'Reduce the maximum path length between input and output tokens to O(1) operations',
      'Establish state-of-the-art translation performance with reduced training compute'
    ],
    atAGlance: {
      problem: {
        title: 'Sequential Processing Bottleneck',
        summary: 'RNNs process tokens step-by-step ($h_t$ depends on $h_{t-1}$), making GPU parallelization impossible across sequence positions. Long-range dependencies decay over distance.',
        significance: 'Fundamentally capped scaling laws and throughput for natural language understanding and machine translation.'
      },
      approach: {
        title: 'Pure Self-Attention Mechanism',
        summary: 'Replaces recurrence with Multi-Head Attention, Scaled Dot-Product Attention, and Positional Encodings. Encoder and decoder process all tokens simultaneously.',
        keyInnovation: 'Decouples signal propagation distance from token position distance ($O(1)$ constant path length).'
      },
      data: {
        title: 'Standard MT Benchmarks',
        summary: 'Trained and evaluated on standard WMT 2014 translation benchmarks using byte-pair encoding (BPE) vocabularies.',
        benchmarks: ['WMT 2014 English-to-German (4.5M sentence pairs)', 'WMT 2014 English-to-French (36M sentence pairs)']
      },
      results: {
        title: 'Unprecedented BLEU & Speed',
        summary: 'Set new state-of-the-art on both translation benchmarks while training in 3.5 days on 8 NVIDIA P100 GPUs.',
        highlight: '28.4 BLEU on En-De (+2.0 over prior ensemble SOTA); 41.8 BLEU on En-Fr.'
      },
      limitations: {
        title: 'Quadratic Attention Complexity',
        summary: 'Self-attention memory and computation scale quadratically ($O(n^2)$) with sequence length, making very long documents prohibitively expensive.',
        criticalBottleneck: '$O(n^2)$ memory footprint for raw attention matrix storage.'
      }
    },
    researchMap: {
      nodes: [
        {
          id: 'n_problem',
          label: 'Sequential Recurrence Bottleneck',
          category: 'problem',
          description: 'Recurrent architectures (RNN/LSTM) inherently serialize token computation, precluding horizontal GPU parallelization.',
          details: 'Signal propagation across n positions requires O(n) sequential steps. Gradients suffer from vanishing/exploding dynamics over extended spans.',
          x: 120,
          y: 80
        },
        {
          id: 'n_method',
          label: 'Multi-Head Self-Attention',
          category: 'method',
          description: 'Allows the model to jointly attend to information from different representation subspaces at different positions.',
          details: 'Uses queries, keys, and values projected into h parallel heads with dimension d_k = d_model / h = 64.',
          x: 420,
          y: 70
        },
        {
          id: 'n_pos',
          label: 'Sinusoidal Positional Encoding',
          category: 'method',
          description: 'Injects sequence order without recurrence using fixed sine and cosine functions of varying frequencies.',
          details: 'Allows the model to learn relative positions because PE(pos+k) can be expressed as a linear function of PE(pos).',
          x: 430,
          y: 220
        },
        {
          id: 'n_dataset',
          label: 'WMT 2014 En-De & En-Fr',
          category: 'dataset',
          description: 'Standard translation datasets containing 4.5M and 36M bilingual sentence pairs.',
          details: 'Tokenized using shared byte-pair encoding (BPE) vocabulary of ~37,000 tokens for En-De and 32,000 word-piece for En-Fr.',
          x: 130,
          y: 350
        },
        {
          id: 'n_model',
          label: 'Transformer Encoder-Decoder',
          category: 'model',
          description: '6-layer encoder and 6-layer decoder with residual connections and layer normalization.',
          details: 'Encoder maps (x_1, ..., x_n) to continuous representations z. Decoder auto-regressively generates output (y_1, ..., y_m) one symbol at a time.',
          x: 740,
          y: 130
        },
        {
          id: 'n_experiments',
          label: 'Training on 8x P100 GPUs',
          category: 'experiments',
          description: 'Base model trained for 100K steps (12 hours); Big model trained for 300K steps (3.5 days).',
          details: 'Adam optimizer with beta1=0.9, beta2=0.98, warmup learning rate schedule with 4000 warmup steps, label smoothing epsilon=0.1.',
          x: 740,
          y: 320
        },
        {
          id: 'n_findings',
          label: 'SOTA Translation (28.4 & 41.8 BLEU)',
          category: 'findings',
          description: 'Outperformed all existing models including recurrent ensembles with significantly reduced FLOPs.',
          details: 'Transformer (big) achieved 28.4 BLEU on En-De and 41.8 BLEU on En-Fr, establishing a new SOTA milestone.',
          x: 1040,
          y: 170
        },
        {
          id: 'n_limitations',
          label: 'O(n²) Context Scaling',
          category: 'limitations',
          description: 'Attention matrix memory grows quadratically with sequence length n.',
          details: 'Restricted practical context window in the initial paper to 512 tokens. Auto-regressive decoding remains sequential at inference time.',
          x: 1040,
          y: 340
        },
        {
          id: 'n_future',
          label: 'Foundation for Generative Pre-training',
          category: 'future_work',
          description: 'Applying attention to broader modalities, speech, vision, and masked language modeling.',
          details: 'Laid the architectural groundwork for BERT, GPT, T5, Vision Transformers, and modern Large Language Models.',
          x: 1040,
          y: 490
        }
      ],
      edges: [
        { id: 'e1', source: 'n_problem', target: 'n_method', label: 'addresses' },
        { id: 'e2', source: 'n_method', target: 'n_model', label: 'uses' },
        { id: 'e3', source: 'n_pos', target: 'n_model', label: 'uses' },
        { id: 'e4', source: 'n_dataset', target: 'n_experiments', label: 'evaluates' },
        { id: 'e5', source: 'n_model', target: 'n_experiments', label: 'evaluates' },
        { id: 'e6', source: 'n_experiments', target: 'n_findings', label: 'results in' },
        { id: 'e7', source: 'n_findings', target: 'n_limitations', label: 'limited by' },
        { id: 'e8', source: 'n_findings', target: 'n_future', label: 'extends' }
      ]
    },
    methodologyFlowchart: [
      {
        stepNumber: 1,
        phase: 'Problem Formulation',
        title: 'Non-Recurrent Sequence Transduction',
        description: 'Formulate sequence-to-sequence translation as mapping an input sequence to output sequence purely through attention-weighted associative lookups without recurrent state transitions.',
        inputs: ['Source sequence (x_1, ..., x_n)', 'Target prefix (y_1, ..., y_{i-1})'],
        outputs: ['Discrete token embeddings', 'Positional coordinate signals'],
        keyTechnique: 'Decoupling computation step from sequence position'
      },
      {
        stepNumber: 2,
        phase: 'Coordinate Embedding',
        title: 'Sinusoidal Positional Encoding',
        description: 'Add fixed trigonometric functions (sin/cos of frequencies spanning 1 to 10000) directly to input embeddings to preserve word order semantics.',
        inputs: ['d_model dimensional token vectors (d=512)'],
        outputs: ['Order-aware position-infused representations'],
        keyTechnique: 'PE(pos, 2i) = sin(pos/10000^(2i/d_model))'
      },
      {
        stepNumber: 3,
        phase: 'Core Transformation',
        title: 'Multi-Head Attention & Feed-Forward Stack',
        description: 'Pass vectors through 6 identical encoder layers and 6 decoder layers. Each layer contains multi-head self-attention, cross-attention (in decoder), and a point-wise position-wise feedforward network.',
        inputs: ['Positional vectors', 'Causal decoder masks'],
        outputs: ['Contextual contextualized memory states z', 'Next-token logits'],
        keyTechnique: 'Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V'
      },
      {
        stepNumber: 4,
        phase: 'Regularization & Optimization',
        title: 'Warmup Schedule & Label Smoothing',
        description: 'Train with Adam optimizer using linear warmup for 4000 steps followed by inverse square root decay. Apply dropout (0.1) to sub-layer outputs and label smoothing (eps_ls = 0.1).',
        inputs: ['Cross-entropy loss with smoothed targets'],
        outputs: ['Stable parameter weights across 8 P100 GPUs'],
        keyTechnique: 'Learning rate lr = d_model^(-0.5) * min(step^(-0.5), step * warmup^(-1.5))'
      },
      {
        stepNumber: 5,
        phase: 'Evaluation & Generation',
        title: 'Autoregressive Beam Search Decoding',
        description: 'Generate translations on test sets using beam search with beam size 4 and length penalty alpha=0.6. Measure case-sensitive tokenized BLEU scores.',
        inputs: ['Target vocab prefix', 'Trained decoder weights'],
        outputs: ['WMT En-De: 28.4 BLEU', 'WMT En-Fr: 41.8 BLEU'],
        keyTechnique: 'Beam search with length penalty lp = ((5 + |Y|)/6)^0.6'
      }
    ],
    keyFindings: {
      quantitative: [
        {
          metricName: 'BLEU Score (English-to-German)',
          baselineValue: '26.4 BLEU',
          paperValue: '28.4 BLEU',
          baselineModel: 'ConvS2S Ensemble (Gehring et al.)',
          paperModel: 'Transformer (big)',
          benchmarkOrDataset: 'WMT 2014 En-De',
          improvement: '+2.0 BLEU',
          numericBaseline: 26.4,
          numericPaper: 28.4,
          higherIsBetter: true,
          notes: 'Single model surpassed all previously reported ensembles while using 1/3 of the training compute.'
        },
        {
          metricName: 'BLEU Score (English-to-French)',
          baselineValue: '41.29 BLEU',
          paperValue: '41.8 BLEU',
          baselineModel: 'ConvS2S Ensemble',
          paperModel: 'Transformer (big)',
          benchmarkOrDataset: 'WMT 2014 En-Fr',
          improvement: '+0.51 BLEU',
          numericBaseline: 41.29,
          numericPaper: 41.8,
          higherIsBetter: true,
          notes: 'New state of the art; trained for 3.5 days on 8 GPUs compared to months for previous architectures.'
        },
        {
          metricName: 'Training FLOPs (En-De to reach SOTA)',
          baselineValue: '9.6e19 FLOPs',
          paperValue: '2.3e18 FLOPs',
          baselineModel: 'ByteNet (Kalchbrenner et al.)',
          paperModel: 'Transformer (base)',
          benchmarkOrDataset: 'WMT 2014 En-De',
          improvement: '~4x compute reduction',
          numericBaseline: 9.6,
          numericPaper: 2.3,
          higherIsBetter: false,
          notes: 'Calculated from reported GPU days and hardware peak TFLOPs in Table 2.'
        },
        {
          metricName: 'English Constituency Parsing (F1)',
          baselineValue: '91.3 F1',
          paperValue: '92.7 F1',
          baselineModel: 'Recurrent Neural Network Grammar (Dyer et al.)',
          paperModel: 'Transformer (4-layer WSJ only)',
          benchmarkOrDataset: 'WSJ section 23 (semi-supervised)',
          improvement: '+1.4 F1',
          numericBaseline: 91.3,
          numericPaper: 92.7,
          higherIsBetter: true,
          notes: 'Demonstrated Transformer generalization capability outside pure machine translation.'
        },
        {
          metricName: 'Inference Latency per Token (ms)',
          baselineValue: 'Not reported',
          paperValue: 'Not reported',
          baselineModel: 'GNMT',
          paperModel: 'Transformer',
          benchmarkOrDataset: 'Greedy decoding benchmark',
          notes: 'Paper measures training time and FLOPs rigorously, but does not benchmark per-token inference wall-clock latency.'
        }
      ],
      qualitative: [
        {
          title: 'Maximum Path Length Reduction',
          insight: 'Self-attention connects any two positions in a sequence in O(1) operations, whereas RNNs require O(n) and CNNs require O(log_k n).',
          significance: 'Makes learning relationships between distant words as easy as learning relationships between adjacent words.'
        },
        {
          title: 'Specialized Subspace Attention Heads',
          insight: 'Different attention heads specialize in distinct linguistic functions: some track syntactic dependencies, while others attend to coreference or sentence boundaries.',
          significance: 'Validates that multi-head projection gives representational diversity rather than redundant averaging.'
        },
        {
          title: 'Ablation on Attention Dimension',
          insight: 'Reducing head count h below 8 hurts quality (28.0 -> 26.8 BLEU), while increasing head count too far also degrades quality as d_k becomes too small.',
          significance: 'Reveals optimal sweet spot for representation subspace projection.'
        }
      ]
    },
    timelineEvolution: [
      {
        year: '2014',
        workTitle: 'Sequence to Sequence Learning with Neural Networks',
        authorsOrGroup: 'Sutskever, Vinyals, Le (Google)',
        coreContribution: 'Pioneered multilayered LSTM encoder-decoder architectures for mapping sequences to sequences.',
        paperDifference: 'Transformer discards the recurrent state transfer between tokens entirely in favor of parallel self-attention.'
      },
      {
        year: '2014',
        workTitle: 'Neural Machine Translation by Jointly Learning to Align and Translate',
        authorsOrGroup: 'Bahdanau, Cho, Bengio',
        coreContribution: 'Introduced additive attention to connect the final encoder states to the recurrent decoder hidden states.',
        paperDifference: 'Transformer uses self-attention within encoder layers and within decoder layers, not just between encoder and decoder.'
      },
      {
        year: '2016',
        workTitle: 'Neural GPUs & ByteNet',
        authorsOrGroup: 'Kalchbrenner et al. (DeepMind)',
        coreContribution: 'Used 1D dilated convolutions to achieve sub-linear O(log n) path length between tokens.',
        paperDifference: 'Transformer brings path length down to O(1) constant time without dilated convolutions.'
      },
      {
        year: '2017',
        workTitle: 'Convolutional Sequence to Sequence Learning (ConvS2S)',
        authorsOrGroup: 'Gehring et al. (Facebook AI Research)',
        coreContribution: 'Gated convolutional networks for translation that parallelized over source words during training.',
        paperDifference: 'Transformer removed the hierarchical receptive field constraint of CNNs, achieving higher BLEU with lower compute.'
      },
      {
        year: '2017',
        workTitle: 'Attention Is All You Need (This Paper)',
        authorsOrGroup: 'Vaswani et al. (Google Brain & Research)',
        coreContribution: 'First sequence model relying entirely on self-attention, setting new SOTA with O(1) path length.',
        paperDifference: 'Current paper under analysis.'
      }
    ],
    conceptsAndVariables: [
      {
        term: 'Multi-Head Attention (MHA)',
        definition: 'Projecting queries, keys, and values h times with learned linear projections, executing dot-product attention in parallel, and concatenating outputs.',
        roleInPaper: 'Core architectural primitive preventing averaging across conflicting representation subspaces.'
      },
      {
        term: 'Scaled Dot-Product Attention',
        definition: 'softmax((QK^T) / sqrt(d_k)) * V where scaling factor 1/sqrt(d_k) counteracts extremely small gradients in high dimensions.',
        roleInPaper: 'Mathematical foundation of the attention calculation.'
      },
      {
        term: 'd_model (512)',
        definition: 'Dimensionality of input and output embeddings throughout all layers of the model.',
        roleInPaper: 'Standardized hidden dimension ensuring residual connections work seamlessly.'
      },
      {
        term: 'd_ff (2048)',
        definition: 'Inner dimension of the two-layer feedforward network with ReLU activation applied to each position separately.',
        roleInPaper: 'Provides non-linear capacity expansion between attention mixing steps.'
      },
      {
        term: 'Causal Masking',
        definition: 'Setting attention scores to -infinity for future token positions in the decoder.',
        roleInPaper: 'Guarantees the model cannot peek at subsequent words during autoregressive decoding.'
      }
    ],
    importantReferences: [
      {
        citation: 'Bahdanau, D., Cho, K., & Bengio, Y. (2014). Neural machine translation by jointly learning to align and translate. ICLR 2015.',
        relevance: 'Introduced the foundational attention concept that Transformer generalized into self-attention.'
      },
      {
        citation: 'Gehring, J., Auli, M., Grangier, D., Yarats, D., & Dauphin, Y. N. (2017). Convolutional sequence to sequence learning. ICML 2017.',
        relevance: 'Prior state-of-the-art benchmark that Transformer outperformed in BLEU score and training throughput.'
      },
      {
        citation: 'Sennrich, R., Haddow, B., & Birch, A. (2016). Neural machine translation of rare words with subword units. ACL 2016.',
        relevance: 'Provided the Byte-Pair Encoding (BPE) subword segmentation methodology used for all vocabulary preprocessing.'
      }
    ]
  },
  {
    id: 'lora-low-rank-adaptation',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: [
      'Edward J. Hu',
      'Yelong Shen',
      'Phillip Wallis',
      'Zeyuan Allen-Zhu',
      'Yuanzhi Li',
      'Shean Wang',
      'Lu Wang',
      'Weizhu Chen'
    ],
    year: '2021',
    venue: 'ICLR 2022 (International Conference on Learning Representations)',
    doi: '10.48550/arXiv.2106.09685',
    tldr: 'Freezes pre-trained model weights and injects trainable low-rank decomposition matrices into transformer layers, cutting trainable parameters by 10,000x and GPU memory by 3x with zero added inference latency.',
    abstract: 'An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to specific tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. Using GPT-3 175B as an example - deploying independent instances of fine-tuned models, each with 175B parameters, is prohibitively expensive. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to fine-tuning of GPT-3 175B with Adam, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times. LoRA performs on-par or better than fine-tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency.',
    researchProblem: 'Fine-tuning full parameters of massive language models (e.g., 175B parameters) requires storing separate giant checkpoints for each downstream task, causing severe storage, GPU VRAM, and deployment bottlenecks.',
    researchObjectives: [
      'Reduce trainable parameter count by multiple orders of magnitude without sacrificing downstream task accuracy',
      'Prevent inference latency penalties introduced by serialized adapter layers',
      'Enable seamless multi-task switching by sharing frozen base weights and swapping lightweight rank matrices',
      'Achieve parity or superiority over full fine-tuning across natural language understanding and generation benchmarks'
    ],
    atAGlance: {
      problem: {
        title: 'Full Fine-Tuning Storage & VRAM Explosion',
        summary: 'Fine-tuning 175B models requires 1.2TB of optimizer states and independent 350GB checkpoint files per task, making multi-task deployment economically unviable.',
        significance: 'Impeded the democratization of enterprise foundation model customization.'
      },
      approach: {
        title: 'Low-Rank Weight Decomposition',
        summary: 'Freezes base weight $W_0 \\in \\mathbb{R}^{d \\times k}$ and parameterizes the update as $\\Delta W = B \\cdot A$ where $B \\in \\mathbb{R}^{d \\times r}$, $A \\in \\mathbb{R}^{r \\times k}$ with rank $r \\ll \\min(d, k)$.',
        keyInnovation: 'During inference, $W = W_0 + BA$ can be merged directly into base weights, introducing exactly 0ms of latency.'
      },
      data: {
        title: 'Standard NLP Benchmarks',
        summary: 'Tested extensively on GLUE (NLU), E2E NLG Challenge, WebNLG, and DART generation datasets across RoBERTa, DeBERTa, GPT-2, and GPT-3.',
        benchmarks: ['GLUE Benchmark (8 NLU tasks)', 'E2E NLG Challenge', 'WebNLG Challenge 2017', 'DART Benchmark']
      },
      results: {
        title: '10,000x Fewer Parameters, Match/Surpass SOTA',
        summary: 'On GPT-3 175B, LoRA matches or beats full fine-tuning with only 37.7M parameters vs 175,000M parameters, reducing VRAM consumption by 3x.',
        highlight: 'Matches full fine-tuning with rank r as low as 1 or 2.'
      },
      limitations: {
        title: 'Batch Heterogeneity at Inference',
        summary: 'Merging weights $W = W_0 + BA$ works when serving one task per batch. If a single dynamic batch contains requests for multiple different tasks, weight merging cannot be used without routing overhead.',
        criticalBottleneck: 'Dynamic multi-tenant batch scheduling across differing task adapter matrices.'
      }
    },
    researchMap: {
      nodes: [
        {
          id: 'n_problem',
          label: '175B Parameter Fine-Tuning Crisis',
          category: 'problem',
          description: 'Storing full model checkpoints for every fine-tuned task is computationally and operationally prohibitive.',
          details: 'Optimizer states for Adam require 16 bytes per parameter, consuming hundreds of gigabytes of GPU memory during backpropagation.',
          x: 120,
          y: 80
        },
        {
          id: 'n_method',
          label: 'Rank Decomposition Matrix (BA)',
          category: 'method',
          description: 'Decomposes weight updates delta W into low-rank matrices B and A with rank r as small as 1, 2, or 4.',
          details: 'Matrix A is initialized with random Gaussian N(0, sigma^2) and B is initialized with zeros, so delta W starts at zero.',
          x: 420,
          y: 70
        },
        {
          id: 'n_model',
          label: 'Weight Merging Without Latency',
          category: 'model',
          description: 'Adds BA directly to W_0 upon deployment, maintaining exact same inference FLOPs and architecture.',
          details: 'When switching downstream tasks, subtract BA and add B_new A_new, with zero memory overhead or architectural changes.',
          x: 740,
          y: 120
        },
        {
          id: 'n_dataset',
          label: 'GLUE, E2E NLG & WebNLG',
          category: 'dataset',
          description: 'Standard evaluation benchmarks covering natural language understanding and structured data-to-text generation.',
          details: 'Includes multi-genre NLI (MNLI), sentiment (SST-2), semantic equivalence (QQP), and structured table-to-text generation.',
          x: 130,
          y: 350
        },
        {
          id: 'n_experiments',
          label: 'Ablation on Rank r and Weight Matrices',
          category: 'experiments',
          description: 'Systematically tested applying LoRA to W_q, W_k, W_v, W_o across ranks r in {1, 2, 4, 8, 64}.',
          details: 'Discovered that adapting both W_q and W_v yields optimal results even with rank r=1 or r=2.',
          x: 430,
          y: 280
        },
        {
          id: 'n_findings',
          label: '10,000x Parameter Cut & Matching Quality',
          category: 'findings',
          description: 'LoRA achieved comparable or superior accuracy compared to full fine-tuning on GPT-3 175B.',
          details: 'Reduced checkpoint size from 350GB to 35MB per task, enabling hosting 100+ task adapters on a single GPU node.',
          x: 1040,
          y: 160
        },
        {
          id: 'n_limitations',
          label: 'Concurrent Mixed-Task Batching',
          category: 'limitations',
          description: 'Merging weights cannot easily accommodate serving different adapters in the exact same forward batch pass.',
          details: 'Requires custom CUDA kernels or specialized serving systems (like S-LoRA/Punica) to multiplex multiple LoRAs per batch.',
          x: 1040,
          y: 340
        },
        {
          id: 'n_future',
          label: 'Extending to Quantized Bases (QLoRA)',
          category: 'future_work',
          description: 'Combining low-rank adaptation with 4-bit NormalFloat base quantization for consumer GPU tuning.',
          details: 'Paved the road for community fine-tuning of LLaMA, Mistral, Stable Diffusion, and open source LLMs.',
          x: 1040,
          y: 490
        }
      ],
      edges: [
        { id: 'e1', source: 'n_problem', target: 'n_method', label: 'addresses' },
        { id: 'e2', source: 'n_method', target: 'n_model', label: 'uses' },
        { id: 'e3', source: 'n_dataset', target: 'n_experiments', label: 'evaluates' },
        { id: 'e4', source: 'n_experiments', target: 'n_model', label: 'evaluates' },
        { id: 'e5', source: 'n_model', target: 'n_findings', label: 'results in' },
        { id: 'e6', source: 'n_findings', target: 'n_limitations', label: 'limited by' },
        { id: 'e7', source: 'n_findings', target: 'n_future', label: 'extends' }
      ]
    },
    methodologyFlowchart: [
      {
        stepNumber: 1,
        phase: 'Hypothesis & Formulation',
        title: 'Intrinsic Low-Rank Dimension Hypothesis',
        description: 'Leverage the observation (Aghajanyan et al., 2020) that the updates delta W during task-specific adaptation have a very low "intrinsic rank" or dimension.',
        inputs: ['Pretrained weight matrix W_0 in R^(d x k)'],
        outputs: ['Low-rank constraint specification r << min(d, k)'],
        keyTechnique: 'W = W_0 + delta W = W_0 + (alpha/r) * B * A'
      },
      {
        stepNumber: 2,
        phase: 'Initialization Strategy',
        title: 'Asymmetric Matrix Initialization',
        description: 'Initialize matrix A with Gaussian random noise N(0, sigma^2) and matrix B with exact zeros. This guarantees delta W = 0 at the start of training, preserving exact base model behavior.',
        inputs: ['Rank dimension r in {1, 2, 4, 8}', 'Scaling factor alpha'],
        outputs: ['Zero delta W initial state with trainable gradients'],
        keyTechnique: 'A ~ N(0, 1/r), B = 0'
      },
      {
        stepNumber: 3,
        phase: 'Forward & Backward Propagation',
        title: 'Frozen Base Parameter Tuning',
        description: 'Freeze all base weights W_0. Pass inputs x through both branches in parallel: h = W_0 x + (alpha/r) B A x. Backpropagate optimizer gradients exclusively into B and A.',
        inputs: ['Mini-batch tokens x'],
        outputs: ['Gradients dL/dA and dL/dB (no optimizer states for W_0)'],
        keyTechnique: '3x GPU memory reduction by omitting Adam states for W_0'
      },
      {
        stepNumber: 4,
        phase: 'Inference Deployment',
        title: 'Zero-Latency Weight Folding',
        description: 'For deployment, compute explicit product BA and add it directly to W_0 into a single consolidated tensor. No additional matrix multiplications or adapter routing required during inference.',
        inputs: ['Trained adapter checkpoint (35MB)'],
        outputs: ['Folded production model with zero additional latency'],
        keyTechnique: 'W_deployed = W_0 + (alpha/r) * B * A'
      }
    ],
    keyFindings: {
      quantitative: [
        {
          metricName: 'Trainable Parameters (GPT-3 175B)',
          baselineValue: '175,000 M (100%)',
          paperValue: '37.7 M (0.02%)',
          baselineModel: 'Full Fine-Tuning',
          paperModel: 'LoRA (r=4)',
          benchmarkOrDataset: 'GPT-3 175B Architecture',
          improvement: '4,640x parameter reduction',
          numericBaseline: 175000,
          numericPaper: 37.7,
          higherIsBetter: false,
          notes: 'Allows fine-tuning 175B models on 16GB/32GB VRAM instances instead of requiring hundreds of gigabytes.'
        },
        {
          metricName: 'WikiSQL Generation Accuracy',
          baselineValue: '73.8%',
          paperValue: '74.0%',
          baselineModel: 'Full Fine-Tuning (GPT-3)',
          paperModel: 'LoRA (GPT-3 175B)',
          benchmarkOrDataset: 'WikiSQL Benchmark',
          improvement: '+0.2%',
          numericBaseline: 73.8,
          numericPaper: 74.0,
          higherIsBetter: true,
          notes: 'LoRA matched or slightly surpassed full fine-tuning performance despite having 10,000x fewer tunable parameters.'
        },
        {
          metricName: 'MultiNLI Accuracy (MNLI-m)',
          baselineValue: '90.2%',
          paperValue: '90.6%',
          baselineModel: 'Full Fine-Tuning (RoBERTa-large)',
          paperModel: 'LoRA (RoBERTa-large, r=8)',
          benchmarkOrDataset: 'GLUE Benchmark (MNLI)',
          improvement: '+0.4%',
          numericBaseline: 90.2,
          numericPaper: 90.6,
          higherIsBetter: true,
          notes: 'Demonstrated superior generalization on natural language inference tasks.'
        },
        {
          metricName: 'Inference Latency Overhead',
          baselineValue: '18.3% increase',
          paperValue: '0% (0.0 ms)',
          baselineModel: 'Serialized Adapters (Houlsby et al.)',
          paperModel: 'LoRA with Folded Weights',
          benchmarkOrDataset: 'Batch size 1 latency test',
          improvement: 'Eliminated latency penalty completely',
          numericBaseline: 18.3,
          numericPaper: 0,
          higherIsBetter: false,
          notes: 'Houlsby adapter layers introduce sequential latency overhead; LoRA folds weights at deploy time.'
        },
        {
          metricName: 'VRAM Usage on Multi-Tenant Serving',
          baselineValue: 'Not reported',
          paperValue: 'Not reported',
          baselineModel: 'Custom serving stack',
          paperModel: 'LoRA multi-tenant',
          benchmarkOrDataset: 'Dynamic concurrent serving',
          notes: 'Paper does not report multi-tenant serving VRAM numbers; focus is on single-adapter evaluation and training memory.'
        }
      ],
      qualitative: [
        {
          title: 'Intrinsic Rank Sufficiency',
          insight: 'Increasing rank r beyond 4 or 8 does not meaningfully improve downstream task performance, confirming that task-specific adaptation occupies an extremely low-dimensional subspace.',
          significance: 'Researchers do not need large ranks to capture domain adaptation nuances.'
        },
        {
          title: 'Adapting Attention Weights is Sufficient',
          insight: 'Adapting both query (W_q) and value (W_v) attention matrices produces the strongest results, while adapting feedforward matrices yields marginal gains.',
          significance: 'Provides clear parameter budgeting guidance for practitioners.'
        },
        {
          title: 'Subspace Overlap Analysis',
          insight: 'Grassmannian distance and singular value analysis demonstrate that low-rank adaptation preserves the primary direction of gradient signals while filtering high-frequency noise.',
          significance: 'Offers theoretical justification for why LoRA often outperforms full fine-tuning by acting as an implicit regularizer.'
        }
      ]
    },
    timelineEvolution: [
      {
        year: '2019',
        workTitle: 'Parameter-Efficient Transfer Learning for NLP (Houlsby Adapters)',
        authorsOrGroup: 'Houlsby et al. (Google Research)',
        coreContribution: 'Inserted 2-layer bottleneck adapter modules after attention and feedforward layers.',
        paperDifference: 'Houlsby adapters add sequential latency at inference time; LoRA introduces parallel matrices that fold into base weights.'
      },
      {
        year: '2020',
        workTitle: 'Intrinsic Dimensionality of Representation in Language Models',
        authorsOrGroup: 'Aghajanyan et al. (Facebook AI)',
        coreContribution: 'Showed that pre-trained language models have an extremely low intrinsic dimension for downstream tasks.',
        paperDifference: 'Provided theoretical grounding that inspired LoRA low-rank decomposition formulation.'
      },
      {
        year: '2021',
        workTitle: 'Prefix-Tuning: Optimizing Continuous Prompts for Generation',
        authorsOrGroup: 'Li & Liang (Stanford)',
        coreContribution: 'Prepends continuous task-specific virtual prefix vectors to keys and values across transformer layers.',
        paperDifference: 'Prefix-tuning is harder to optimize and reduces effective input context sequence length; LoRA preserves full context window.'
      },
      {
        year: '2021',
        workTitle: 'LoRA: Low-Rank Adaptation (This Paper)',
        authorsOrGroup: 'Hu et al. (Microsoft Corporation)',
        coreContribution: 'Decomposes weight updates via BA matrices with weight folding and zero inference latency.',
        paperDifference: 'Current paper under analysis.'
      }
    ],
    conceptsAndVariables: [
      {
        term: 'Rank r',
        definition: 'The intermediate bottleneck dimension of matrices A and B (typically r in {1, 2, 4, 8}).',
        roleInPaper: 'Controls the trade-off between expressive capacity and parameter count.'
      },
      {
        term: 'Scaling Factor alpha / r',
        definition: 'A constant multiplier applied to BA that scales the magnitude of the adapter update relative to base weights.',
        roleInPaper: 'Eliminates the need to re-tune hyperparameter learning rate when varying rank r.'
      },
      {
        term: 'Weight Folding',
        definition: 'Computing W = W_0 + (alpha/r) * B * A as a single unified weight tensor before deploying to production.',
        roleInPaper: 'Guarantees zero inference latency overhead.'
      },
      {
        term: 'Intrinsic Dimension',
        definition: 'The minimum number of parameters needed to reach 90% of the performance of full parameter tuning.',
        roleInPaper: 'Theoretical foundation proving that fine-tuning trajectories live in low-dimensional manifolds.'
      }
    ],
    importantReferences: [
      {
        citation: 'Houlsby, N., et al. (2019). Parameter-efficient transfer learning for NLP. ICML 2019.',
        relevance: 'Prior adapter approach that introduced inference latency bottleneck solved by LoRA.'
      },
      {
        citation: 'Brown, T., et al. (2020). Language models are few-shot learners (GPT-3). NeurIPS 2020.',
        relevance: 'The 175B foundation model benchmarked by LoRA to demonstrate scaling feasibility.'
      },
      {
        citation: 'Aghajanyan, A., et al. (2021). Intrinsic dimensionality explains the effectiveness of language model fine-tuning. ACL 2021.',
        relevance: 'Proved the low intrinsic dimensionality of language models that motivated low-rank parameterization.'
      }
    ]
  },
  {
    id: 'resnet-deep-residual-learning',
    title: 'Deep Residual Learning for Image Recognition',
    authors: [
      'Kaiming He',
      'Xiangyu Zhang',
      'Shaoqing Ren',
      'Jian Sun'
    ],
    year: '2015',
    venue: 'CVPR 2016 (IEEE Conference on Computer Vision and Pattern Recognition - Best Paper Award)',
    doi: '10.1109/CVPR.2016.90',
    tldr: 'Introduces identity shortcut connections that allow networks to learn residual functions F(x) = H(x) - x, breaking the degradation problem and enabling training of networks over 150 layers deep.',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers—8x deeper than VGG nets but still having lower complexity. An ensemble of these residual nets achieves 3.57% error on the ImageNet test set. This result won the 1st place on the ILSVRC 2015 classification task. We also present analysis on CIFAR-10 with 100 and 1000 layers. Deep representations are of central importance for many visual recognition tasks. Solely due to our extremely deep representations, we obtain a 28% relative improvement on the COCO object detection dataset.',
    researchProblem: 'As neural networks become deeper, accuracy saturates and then degrades rapidly (the "degradation problem")—not due to overfitting, but due to optimization difficulty where deeper plain models have higher training error than shallower counterparts.',
    researchObjectives: [
      'Overcome the degradation problem in deep convolutional neural networks',
      'Formulate residual learning via identity shortcut connections requiring zero additional parameters',
      'Successfully train models up to 152 layers deep on ImageNet and 1000 layers on CIFAR-10',
      'Demonstrate generic visual representation power across ImageNet classification, localization, and COCO detection'
    ],
    atAGlance: {
      problem: {
        title: 'The Depth Degradation Barrier',
        summary: 'Stacking more layers in standard "plain" networks caused higher training error (a 56-layer network had worse training and testing error than a 20-layer network).',
        significance: 'Blocked the computer vision community from unlocking the benefits of deeper feature representations.'
      },
      approach: {
        title: 'Residual Mapping & Skip Connections',
        summary: 'Instead of hoping a stack of layers fits desired mapping $H(x)$, explicitly let layers fit a residual mapping $F(x) := H(x) - x$, outputting $H(x) = F(x) + x$ via identity shortcuts.',
        keyInnovation: 'If identity mapping is optimal, it is far easier to push residual weights to zero than to learn an identity transformation from scratch.'
      },
      data: {
        title: 'ImageNet & MS COCO Benchmarks',
        summary: 'Evaluated on ImageNet 2012 classification (1.28M training images, 1000 classes), CIFAR-10, and MS COCO 2015 object detection/segmentation.',
        benchmarks: ['ImageNet 2012 (1000 classes, 1.28M images)', 'CIFAR-10 (50K images)', 'MS COCO 2015 (80 object classes)']
      },
      results: {
        title: 'Superhuman 3.57% Top-5 Error & Swept ILSVRC',
        summary: 'ResNet-152 achieved 3.57% top-5 error on ImageNet, winning 1st place in all five major categories of ILSVRC & COCO 2015 competitions.',
        highlight: 'Won 1st place in ImageNet Classification, Detection, Localization, COCO Detection, and COCO Segmentation.'
      },
      limitations: {
        title: 'Diminishing Returns Beyond 1000 Layers',
        summary: 'On CIFAR-10, scaling ResNet to 1202 layers resulted in slightly worse test error (7.93%) than 110 layers (6.43%), due to overfitting on the small dataset without added regularization.',
        criticalBottleneck: 'Model capacity outstripping small training set sample sizes without heavy dropout/stochastic depth.'
      }
    },
    researchMap: {
      nodes: [
        {
          id: 'n_problem',
          label: 'The Degradation Problem',
          category: 'problem',
          description: 'Deeper networks suffer from higher training error despite having strictly greater representational capacity.',
          details: 'Vanishing gradients were addressed by batch normalization, yet optimization stagnated when going deeper.',
          x: 120,
          y: 80
        },
        {
          id: 'n_method',
          label: 'Identity Shortcut Connection',
          category: 'method',
          description: 'Bypasses one or more layers, performing element-wise addition F(x) + x.',
          details: 'Introduces zero extra parameters and zero computational complexity. Gradients flow unimpeded directly through the shortcut.',
          x: 420,
          y: 70
        },
        {
          id: 'n_bottleneck',
          label: 'Bottleneck Architecture',
          category: 'model',
          description: '3-layer stack: 1x1 conv (reduce), 3x3 conv, and 1x1 conv (restore dimension).',
          details: 'Enables 50, 101, and 152 layer networks to run with lower computational complexity (FLOPs) than 16-layer VGG-16.',
          x: 430,
          y: 240
        },
        {
          id: 'n_dataset',
          label: 'ImageNet & MS COCO 2015',
          category: 'dataset',
          description: 'Massive scale vision datasets with 1000 categories and dense multi-scale object bounding boxes.',
          details: 'Preprocessed with scale jittering, random cropping, color augmentation, and per-pixel mean subtraction.',
          x: 130,
          y: 350
        },
        {
          id: 'n_experiments',
          label: 'Plain vs Residual Comparison',
          category: 'experiments',
          description: 'Side-by-side training of 18-layer and 34-layer plain vs residual networks under identical hyperparameters.',
          details: 'Conclusively proved that 34-layer plain network had higher training error than 18-layer plain, but 34-layer ResNet had lower error.',
          x: 740,
          y: 120
        },
        {
          id: 'n_findings',
          label: '3.57% Top-5 Error & 1st Place ILSVRC',
          category: 'findings',
          description: 'ResNet swept every competition track in 2015, outperforming human top-5 error rate (~5.1%).',
          details: 'Ensemble of ResNet-152 models achieved 3.57% top-5 error, winning ImageNet classification, detection, and localization.',
          x: 1040,
          y: 160
        },
        {
          id: 'n_limitations',
          label: '1000-Layer Overfitting on CIFAR',
          category: 'limitations',
          description: 'On CIFAR-10 with 50K images, a 1202-layer ResNet trained successfully but suffered test set overfitting.',
          details: 'Test error was 7.93% compared to 6.43% for ResNet-110, showing optimization succeeded but regularization was required.',
          x: 1040,
          y: 340
        },
        {
          id: 'n_future',
          label: 'Universal Vision Backbone',
          category: 'future_work',
          description: 'Became the universal standard feature extractor for Faster R-CNN, Mask R-CNN, semantic segmentation, and deep learning.',
          details: 'Inspired ResNeXt, DenseNet, Wide ResNet, and deep residual pathways across all modern neural architectures.',
          x: 1040,
          y: 490
        }
      ],
      edges: [
        { id: 'e1', source: 'n_problem', target: 'n_method', label: 'addresses' },
        { id: 'e2', source: 'n_method', target: 'n_bottleneck', label: 'uses' },
        { id: 'e3', source: 'n_dataset', target: 'n_experiments', label: 'evaluates' },
        { id: 'e4', source: 'n_bottleneck', target: 'n_experiments', label: 'evaluates' },
        { id: 'e5', source: 'n_experiments', target: 'n_findings', label: 'results in' },
        { id: 'e6', source: 'n_findings', target: 'n_limitations', label: 'limited by' },
        { id: 'e7', source: 'n_findings', target: 'n_future', label: 'extends' }
      ]
    },
    methodologyFlowchart: [
      {
        stepNumber: 1,
        phase: 'Problem Identification',
        title: 'Empirical Verification of Degradation',
        description: 'Observe that deeper networks have higher training error than shallower ones, proving that optimization failure—not overfitting or vanishing gradients—is the true limiting factor.',
        inputs: ['Plain-18 network', 'Plain-34 network'],
        outputs: ['Proof of higher training error in deeper plain nets'],
        keyTechnique: 'Controlled depth isolation with Batch Normalization'
      },
      {
        stepNumber: 2,
        phase: 'Mathematical Reformulation',
        title: 'Residual Mapping Formulation',
        description: 'Reparameterize underlying mapping H(x) as F(x) + x, where F(x) is learned by stacked convolutional layers. If identity mapping is optimal, weights can easily decay toward zero.',
        inputs: ['Input feature map x'],
        outputs: ['Residual representation F(x) = H(x) - x'],
        keyTechnique: 'Identity skip connections without additional parameters'
      },
      {
        stepNumber: 3,
        phase: 'Architectural Design',
        title: 'Bottleneck Building Block for Ultra-Depth',
        description: 'To enable 50+ layers without exploding training time, construct 3-layer bottleneck blocks: 1x1 conv to compress channels (e.g. 256 -> 64), 3x3 conv, and 1x1 conv to restore channels (64 -> 256).',
        inputs: ['High-dimensional feature maps (e.g. 256 channels)'],
        outputs: ['Economical deep representations with lower FLOPs than VGG'],
        keyTechnique: '1x1 bottleneck dimension reduction'
      },
      {
        stepNumber: 4,
        phase: 'Optimization & Training',
        title: 'SGD with Batch Normalization',
        description: 'Train with SGD, batch size 256, momentum 0.9, weight decay 0.0001. Learning rate initialized at 0.1 and divided by 10 at plateaus. No dropout needed due to Batch Normalization.',
        inputs: ['ImageNet 1.28M crops (224x224)'],
        outputs: ['152-layer converged model with 11.3B FLOPs'],
        keyTechnique: 'Batch Normalization applied immediately after each convolution'
      },
      {
        stepNumber: 5,
        phase: 'Multi-Task Evaluation',
        title: 'Cross-Benchmark Generalization',
        description: 'Deploy trained ResNet features into Faster R-CNN detection heads on MS COCO and Pascal VOC to evaluate transferability of learned visual representations.',
        inputs: ['Trained ResNet-101 backbone'],
        outputs: ['COCO mAP@0.5: 48.4% (vs 41.5% with VGG-16)'],
        keyTechnique: 'Backbone feature transfer with deep representations'
      }
    ],
    keyFindings: {
      quantitative: [
        {
          metricName: 'ImageNet Top-5 Error (Validation)',
          baselineValue: '8.43%',
          paperValue: '4.49%',
          baselineModel: 'VGG-16 (Simonyan & Zisserman)',
          paperModel: 'ResNet-152 (Single Model)',
          benchmarkOrDataset: 'ImageNet 2012 Val (10-crop)',
          improvement: '3.94% absolute reduction',
          numericBaseline: 8.43,
          numericPaper: 4.49,
          higherIsBetter: false,
          notes: 'ResNet-152 single model beat the winning ensemble of GoogLeNet (6.66%) by a wide margin.'
        },
        {
          metricName: 'ImageNet Top-5 Error (Test Ensemble)',
          baselineValue: '6.67%',
          paperValue: '3.57%',
          baselineModel: 'GoogLeNet Ensemble (ILSVRC 2014 winner)',
          paperModel: 'ResNet Ensemble (6 models)',
          benchmarkOrDataset: 'ILSVRC 2015 Test Set',
          improvement: '3.10% absolute reduction',
          numericBaseline: 6.67,
          numericPaper: 3.57,
          higherIsBetter: false,
          notes: 'Won 1st place in ILSVRC 2015; recognized as surpassing human-level recognition accuracy (~5.1%).'
        },
        {
          metricName: 'COCO Object Detection mAP@[.5, .95]',
          baselineValue: '21.5%',
          paperValue: '27.2%',
          baselineModel: 'Faster R-CNN with VGG-16',
          paperModel: 'Faster R-CNN with ResNet-101',
          benchmarkOrDataset: 'MS COCO 2015 Test-dev',
          improvement: '+26.5% relative increase',
          numericBaseline: 21.5,
          numericPaper: 27.2,
          higherIsBetter: true,
          notes: 'Attributed entirely to the deeper representations of the 101-layer residual network.'
        },
        {
          metricName: 'Model Computational Complexity (FLOPs)',
          baselineValue: '15.3 x 10^9',
          paperValue: '11.3 x 10^9',
          baselineModel: 'VGG-16 (16 layers)',
          paperModel: 'ResNet-152 (152 layers)',
          benchmarkOrDataset: 'Forward pass FLOPs',
          improvement: '26% fewer FLOPs despite 9.5x more layers',
          numericBaseline: 15.3,
          numericPaper: 11.3,
          higherIsBetter: false,
          notes: 'Due to aggressive downsampling early on and 1x1 bottleneck projections.'
        },
        {
          metricName: 'GPU Inference Latency on Mobile Chips',
          baselineValue: 'Not reported',
          paperValue: 'Not reported',
          baselineModel: 'MobileNet',
          paperModel: 'ResNet-50',
          benchmarkOrDataset: 'Embedded edge benchmarks',
          notes: 'Mobile latency benchmarks were not reported; paper focused on server GPU training and accuracy.'
        }
      ],
      qualitative: [
        {
          title: 'Resolution of the Degradation Paradox',
          insight: 'Constructing a deeper model by appending identity mapping layers to a shallower model should theoretically never produce higher training error. The residual connection guarantees this property in practice.',
          significance: 'Unlocked arbitrary depth scaling for deep neural architectures.'
        },
        {
          title: 'Residual Responses are Extremely Small',
          insight: 'Analysis of layer response standard deviations shows that residual functions F(x) generally have much smaller activations than unreferenced functions, proving that identity mappings provide reasonable preconditioning.',
          significance: 'Confirms that weights only need to learn small perturbations on top of identity.'
        },
        {
          title: 'Zero Parameter Cost of Shortcuts',
          insight: 'Identity shortcuts require zero additional parameters or complex gating logic, unlike Highway Networks or LSTM cell gates.',
          significance: 'Enables massive depth scaling with minimal computational overhead.'
        }
      ]
    },
    timelineEvolution: [
      {
        year: '2012',
        workTitle: 'AlexNet (ImageNet Classification with Deep CNNs)',
        authorsOrGroup: 'Krizhevsky, Sutskever, Hinton (Univ. of Toronto)',
        coreContribution: 'Showed that 8-layer deep CNNs trained on GPUs with ReLU and Dropout revolutionize computer vision.',
        paperDifference: 'ResNet scales this depth by nearly 20x (from 8 layers to 152 layers) via skip connections.'
      },
      {
        year: '2014',
        workTitle: 'VGG (Very Deep Convolutional Networks for Large-Scale Image Recognition)',
        authorsOrGroup: 'Simonyan & Zisserman (Oxford VGG)',
        coreContribution: 'Standardized small 3x3 convolution filters and pushed depth to 16 and 19 layers.',
        paperDifference: 'VGG hit a wall at 19 layers where deeper models failed to train effectively; ResNet solved this barrier.'
      },
      {
        year: '2015',
        workTitle: 'Highway Networks',
        authorsOrGroup: 'Srivastava, Greff, Schmidhuber',
        coreContribution: 'Introduced adaptive gating units to allow information to flow across hundreds of layers.',
        paperDifference: 'Highway networks use parameterized gates with extra weights; ResNet uses parameter-free identity shortcuts that never close.'
      },
      {
        year: '2015',
        workTitle: 'Deep Residual Learning for Image Recognition (This Paper)',
        authorsOrGroup: 'He, Zhang, Ren, Sun (Microsoft Research)',
        coreContribution: 'Identity shortcut connections for residual learning, training 152 layers and winning ILSVRC 2015.',
        paperDifference: 'Current paper under analysis.'
      }
    ],
    conceptsAndVariables: [
      {
        term: 'Identity Shortcut Connection',
        definition: 'Skipping one or more layers and performing element-wise addition: y = F(x, {W_i}) + x.',
        roleInPaper: 'The central innovation that allows unimpeded backpropagation of gradient signals.'
      },
      {
        term: 'Degradation Problem',
        definition: 'The phenomenon where deeper plain networks achieve higher training error than their shallower counterparts.',
        roleInPaper: 'The core paradox and obstacle solved by this paper.'
      },
      {
        term: 'Bottleneck Design',
        definition: 'A 3-layer residual block comprising 1x1, 3x3, and 1x1 convolutions.',
        roleInPaper: 'Reduces FLOPs and parameter counts to make 50-, 101-, and 152-layer networks feasible.'
      },
      {
        term: 'Projection Shortcut',
        definition: 'Multiplying x by a learned linear matrix W_s when channel dimensions increase across stages: y = F(x) + W_s * x.',
        roleInPaper: 'Used when feature map dimensions change across spatial pooling stages.'
      }
    ],
    importantReferences: [
      {
        citation: 'Simonyan, K., & Zisserman, A. (2014). Very deep convolutional networks for large-scale image recognition. ICLR 2015.',
        relevance: 'Baseline architecture (VGG-16/19) compared throughout the paper.'
      },
      {
        citation: 'Ioffe, S., & Szegedy, C. (2015). Batch normalization: Accelerating deep network training by reducing internal covariate shift. ICML 2015.',
        relevance: 'Key normalization technique that enabled stable initialization across all residual layers.'
      },
      {
        citation: 'Srivastava, R. K., Greff, K., & Schmidhuber, J. (2015). Highway networks. arXiv:1505.00387.',
        relevance: 'Related prior gated network whose parameterized routing contrasts with ResNet pure identity shortcuts.'
      }
    ]
  }
];
