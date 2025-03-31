[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docs](https://img.shields.io/badge/docs-latest-blue)](https://the-pocket-world.github.io/Pocket-Flow-Framework/)

# 🚀 Pocket Flow Framework

**A Core Component of the [PocketFlow Platform](https://pocketflow.ai/)**

> Build enterprise-ready AI systems—fast, modular, and vendor-agnostic.

<p align="center">
  <img src="./assets/arc.png" width="700"/>
</p>

## Overview

The Pocket Flow Framework is one of the foundational abstractions behind **[PocketFlow](https://pocketflow.ai/)**, a platform designed to empower users to build custom AI workflows using natural language prompts. 

We began building this original framework internally in November. Recognizing its potential, we open-sourced the Python version in December and the TypeScript version in February to share our approach with the broader community.

## Why Pocket Flow Framework?

At the heart of complex AI systems and enterprise automation lies the need for structured, manageable workflows. The Pocket Flow Framework implements what we see as the core abstraction for most LLM applications: A **Nested Directed Graph**.

<p align="center">
  <img src="./assets/abstraction.png" width="700"/>
</p>

This graph-based approach allows breaking down complex tasks into smaller, reusable steps (nodes), incorporating branching and recursion for agent-like decision-making. This foundation makes it straightforward to layer on advanced capabilities required by modern AI systems.

<p align="center">
  <img src="./assets/paradigm.png" width="700"/>
</p>

Examples of features easily built upon this framework include:
- [Multi-Agent Systems](https://the-pocket-world.github.io/Pocket-Flow-Framework/multi_agent/)
- [Prompt Chaining & Decomposition](https://the-pocket-world.github.io/Pocket-Flow-Framework/decomp/)
- [Retrieval-Augmented Generation (RAG)](https://the-pocket-world.github.io/Pocket-Flow-Framework/rag/)

## ✨ Key Features

- 🔄 **Nested Directed Graph Structure**: Enables modularity and reusability, where each node represents a distinct processing unit.
- 🔓 **Vendor Agnostic**: Designed for flexibility, allowing integration with any LLM or external API without requiring specialized wrappers.
- 🔍 **Enhanced Debuggability**: Provides tools for visualizing workflows and managing state persistence, simplifying development and troubleshooting.

## 📚 Get Started

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/The-Pocket-World/Pocket-Flow-Framework.git # Or your specific repo URL if different
    cd Pocket-Flow-Framework
    ```
2.  **Explore the Documentation:**
    Dive deeper into the concepts, architecture, and examples: [Official Documentation](https://the-pocket-world.github.io/Pocket-Flow-Framework/)

*(Note: We are actively working on adding more examples to showcase the framework's capabilities.)*
