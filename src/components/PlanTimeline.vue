<template>
  <section class="panel timeline-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Four-Week Plan</p>
        <h2>{{ artifact }}</h2>
      </div>
      <i data-lucide="route"></i>
    </div>

    <ol class="timeline">
      <li v-for="step in steps" :key="step.week">
        <span>{{ step.week }}</span>
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.action }}</p>
          <small>{{ step.evidence }}</small>
        </div>
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  props: {
    steps: { type: Array, required: true },
    artifact: { type: String, required: true },
  },
};
</script>
