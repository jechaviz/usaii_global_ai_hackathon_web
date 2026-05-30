<template>
  <section :class="['panel recommendation-panel', { compact }]">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Recommended Path</p>
        <h2>{{ recommendation.opportunity.title }}</h2>
      </div>
      <strong class="score-badge">{{ recommendation.score }}</strong>
    </div>

		<img class="coach-map" src="/assets/coach-map.png" alt="Study-to-work flow map">

    <p class="artifact">{{ recommendation.opportunity.portfolio_artifact }}</p>

    <div class="reason-grid">
      <span v-for="reason in recommendation.reasons.slice(0, 5)" :key="reason">{{ reason }}</span>
    </div>

    <div class="gap-list" aria-label="Skill gaps">
      <article v-for="gap in gaps" :key="gap.skill">
        <span>{{ gap.skill.replaceAll('_', ' ') }}</span>
        <progress :value="gap.current" :max="gap.target"></progress>
        <strong>{{ gap.current }}/{{ gap.target }}</strong>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    recommendation: { type: Object, required: true },
    gaps: { type: Array, required: true },
    compact: { type: Boolean, default: false },
  },
};
</script>
