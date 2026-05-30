<template>
  <section class="panel skill-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Student Persona</p>
        <h2>{{ profile.name }}</h2>
      </div>
      <i data-lucide="graduation-cap"></i>
    </div>

    <div class="interest-row">
      <span v-for="interest in profile.interests" :key="interest">{{ interest }}</span>
    </div>

    <div class="slider-list">
      <label v-for="(value, skill) in profile.skills" :key="skill" class="skill-slider">
        <span>
          <strong>{{ labelFor(skill) }}</strong>
          <em>{{ value }}</em>
        </span>
        <input
          :value="value"
          type="range"
          min="20"
          max="95"
          step="1"
          @input="$emit('update-skill', { skill, value: $event.target.value })"
        >
      </label>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    profile: { type: Object, required: true },
  },
  emits: ['update-skill'],
  methods: {
    labelFor(skill) {
      return skill.replaceAll('_', ' ');
    },
  },
};
</script>
