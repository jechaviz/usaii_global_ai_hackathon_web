<template>
  <section class="panel judge-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Judge Mode</p>
        <h2>{{ readiness.track }} rubric defense</h2>
      </div>
      <strong class="score-badge">{{ readiness.overall }}</strong>
    </div>

    <div class="delta-strip">
      <article>
        <span>Baseline</span>
        <strong>{{ experiment.baseline_average }}</strong>
      </article>
      <article>
        <span>Coach</span>
        <strong>{{ experiment.coach_average }}</strong>
      </article>
      <article>
        <span>Decision delta</span>
        <strong>+{{ experiment.decision_delta }}</strong>
      </article>
      <article>
        <span>Risk cut</span>
        <strong>{{ experiment.risk_reduction }}%</strong>
      </article>
    </div>

    <div class="rubric-list">
      <article v-for="score in normalizedScores" :key="score.label">
        <span>{{ score.weight }}%</span>
        <div>
          <strong>{{ score.label }}</strong>
          <progress :value="score.score" max="100"></progress>
        </div>
        <em>{{ score.score }}</em>
      </article>
    </div>

    <table class="case-table">
      <thead>
        <tr>
          <th>Case</th>
          <th>Base</th>
          <th>Coach</th>
          <th>Risk</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in normalizedCases" :key="item.student">
          <td>{{ item.student }}</td>
          <td>{{ item.baseline }}</td>
          <td>{{ item.coach }}</td>
          <td>{{ item.riskBefore }} -> {{ item.riskAfter }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  props: {
    experiment: { type: Object, required: true },
    readiness: { type: Object, required: true },
  },
  computed: {
    normalizedScores() {
      return (this.readiness.scores || []).map((score) => Array.isArray(score) ? {
        label: score[0],
        weight: score[1],
        score: score[2],
      } : {
        label: score.dimension.label,
        weight: score.dimension.weight,
        score: score.score,
      });
    },
    normalizedCases() {
      return (this.experiment.cases || []).map((item) => Array.isArray(item) ? {
        student: item[0],
        baseline: item[1],
        coach: item[2],
        riskBefore: item[3],
        riskAfter: item[4],
      } : {
        student: item.student,
        baseline: item.baseline_score,
        coach: item.coach_score,
        riskBefore: item.risk_before,
        riskAfter: item.risk_after,
      });
    },
  },
};
</script>
