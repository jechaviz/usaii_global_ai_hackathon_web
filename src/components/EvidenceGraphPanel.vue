<template>
  <section class="panel evidence-graph-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Evidence Graph</p>
        <h2>Input to receipt</h2>
      </div>
      <i data-lucide="git-branch"></i>
    </div>

    <ol class="evidence-chain">
      <li v-for="node in nodes" :key="node.label">
        <span>{{ node.kind }}</span>
        <div>
          <strong>{{ node.label }}</strong>
          <p>{{ node.evidence }}</p>
          <small>{{ node.status }}</small>
        </div>
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  props: {
    nodes: { type: Array, required: true },
  },
};
</script>
