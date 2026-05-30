<template>
  <header class="topbar">
    <div>
      <p class="eyebrow">USAII Global AI Hackathon 2026</p>
      <h1>AI Study-to-Work Coach</h1>
      <p class="tagline">Student goals, skill gaps, portfolio proof, and responsible AI review in one workspace.</p>
    </div>
    <div class="header-actions">
      <div class="score-pill" aria-label="Current fit score">
        <span>{{ score }}%</span>
        <small>fit</small>
      </div>
      <button class="icon-button" type="button" title="Export packet JSON" @click="$emit('export-packet')">
        <i data-lucide="download"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    score: { type: Number, required: true },
    readiness: { type: Object, required: true },
  },
  emits: ['export-packet'],
};
</script>
