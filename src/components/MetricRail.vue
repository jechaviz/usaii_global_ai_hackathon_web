<template>
  <section class="metric-rail" aria-label="Readiness metrics">
    <article v-for="metric in metrics" :key="metric.label" :class="['metric', metric.tone]">
      <span>{{ metric.label }}</span>
      <strong>{{ metric.value }}</strong>
    </article>
  </section>
</template>

<script>
export default {
  props: {
    metrics: { type: Array, required: true },
  },
};
</script>
