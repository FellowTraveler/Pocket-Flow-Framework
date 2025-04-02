---
layout: default
title: "Pocket Flow Framework"
nav_order: 1
---

# Pocket Flow Framework

The core framework powering **[PocketFlow](https://pocketflow.ai/)**, designed for building robust, modular, and vendor-agnostic LLM-powered applications. It provides the foundational abstractions for creating sophisticated workflows involving:

- Intelligent Agents
- Task Decomposition
- Retrieval Augmented Generation (RAG)
- Multi-step processing and complex logic

## Core Architecture: The Nested Directed Graph

We model LLM workflows using a **Nested Directed Graph** abstraction. This approach provides modularity and reusability, breaking complex problems into manageable, interconnected components.

Key elements include:

- 🔹 **Nodes**: Handle atomic LLM tasks or operations.
- 🔗 **Actions**: Connect nodes (labeled edges), enabling agent-like behaviors and conditional logic.
- 🔄 **Flows**: Orchestrate graphs of nodes, managing task decomposition and execution sequences.
- 📦 **Nesting**: Allows entire flows to be encapsulated and reused as nodes within other flows.
- 📊 **Batch Processing**: Facilitates efficient handling of data-intensive tasks.
- ⚡ **Async Support**: Enables parallel execution for improved performance.

<div align="center">
  <img src="../assets/abstraction.png" width="700"/>
</div>

---

## Getting Started

- [Quick Start](./guide.md)
- [Setup Steps](./preparation.md)
- [Key Abstractions](./core_abstraction.md)

## Core Concepts

- [Agent Basics](./agent.md)
- [Node Fundamentals](./node.md)
- [Understanding Flows](./flow.md)
- [Data Structures](./structure.md)

## Features & Extensions

### Basic Features
- [Async Processing](./async.md)
- [Batch Operations](./batch.md)
- [Communication Patterns](./communication.md)
- [Task Decomposition](./decomp.md)

### Advanced Capabilities
- [Large Language Models](./llm.md)
- [MapReduce Workflows](./mapreduce.md)
- [Memory & Caching](./memory.md)
- [Multi-Agent Systems](./multi_agent.md)
- [Parallel Execution](./parallel.md)
- [Retrieval Augmented Generation](./rag.md)
- [Tool Integrations](./tool.md)

## Examples & Concepts

- [Sample Applications](./apps.md)
- [Conceptual Paradigms](./paradigm.md)
- [Visualizations](./viz.md)

---

<div align="center">
  <p><i>Built with TypeScript for production-grade LLM applications</i></p>
</div>
