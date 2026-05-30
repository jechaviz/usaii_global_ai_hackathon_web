<template>
  <section class="panel guardrail-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Responsible AI</p>
        <h2>Guardrails</h2>
      </div>
      <i data-lucide="shield-check"></i>
    </div>
    <ul class="check-list">
      <li v-for="item in items" :key="item">
        <i data-lucide="check"></i>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    items: { type: Array, required: true },
  },
};
</script>
