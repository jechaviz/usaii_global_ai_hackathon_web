<template>
  <main class="app-shell">
    <AppHeader :score="recommended.score" :readiness="demo.readiness" @export-packet="downloadPacket" />

    <MetricRail :metrics="metrics" />

    <nav class="tab-row" aria-label="Workspace views">
      <button
        v-for="tab in tabs"
				:key="tab.id"
				:class="['tab-button', { active: activeTab === tab.id }]"
				:aria-label="tab.label"
				type="button"
				@click="activeTab = tab.id"
      >
        <i :data-lucide="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <section v-if="activeTab === 'coach'" class="workspace-grid">
      <SkillPanel :profile="profile" @update-skill="updateSkill" />
      <RecommendationPanel :recommendation="recommended" :gaps="gaps" />
      <GuardrailPanel :items="demo.guardrails" />
    </section>

    <section v-else-if="activeTab === 'plan'" class="workspace-grid plan-layout">
      <PlanTimeline :steps="planSteps" :artifact="recommended.opportunity.portfolio_artifact" />
      <RecommendationPanel :recommendation="recommended" :gaps="gaps" compact />
    </section>

    <section v-else-if="activeTab === 'judge'" class="workspace-grid judge-layout">
      <JudgePanel :experiment="experiment" :readiness="judgeReadiness" />
      <EvidenceGraphPanel :nodes="evidenceGraph" />
    </section>

    <section v-else class="workspace-grid submission-layout">
      <SubmissionPanel :packet="packet" :readiness="demo.readiness" />
      <GuardrailPanel :items="demo.guardrails" />
    </section>
  </main>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import MetricRail from './components/MetricRail.vue';
import SkillPanel from './components/SkillPanel.vue';
import RecommendationPanel from './components/RecommendationPanel.vue';
import PlanTimeline from './components/PlanTimeline.vue';
import GuardrailPanel from './components/GuardrailPanel.vue';
import SubmissionPanel from './components/SubmissionPanel.vue';
import JudgePanel from './components/JudgePanel.vue';
import EvidenceGraphPanel from './components/EvidenceGraphPanel.vue';

export default {
  components: {
    AppHeader,
    MetricRail,
    SkillPanel,
    RecommendationPanel,
    PlanTimeline,
    GuardrailPanel,
    SubmissionPanel,
    JudgePanel,
    EvidenceGraphPanel,
  },
  data() {
    const demo = window.usaiiDemoData;
    return {
      demo,
      profile: JSON.parse(JSON.stringify(demo.profile)),
      planData: null,
      experiment: demo.experiment,
      judgeReadiness: demo.judgeReadiness,
      activeTab: 'coach',
      tabs: [
        { id: 'coach', label: 'Coach', icon: 'sparkles' },
        { id: 'plan', label: 'Plan', icon: 'calendar-days' },
        { id: 'judge', label: 'Judge', icon: 'bar-chart-3' },
        { id: 'submission', label: 'Packet', icon: 'send' },
      ],
    };
  },
  computed: {
    ranked() {
      return this.demo.opportunities
        .map((opportunity) => this.scoreOpportunity(opportunity))
        .sort((a, b) => b.score - a.score);
    },
    recommended() {
      return this.ranked[0];
    },
    gaps() {
      return Object.entries(this.recommended.opportunity.required_skills)
        .filter(([skill, target]) => (this.profile.skills[skill] || 0) < target)
        .map(([skill, target]) => ({
          skill,
          current: this.profile.skills[skill] || 0,
          target,
          priority: target - (this.profile.skills[skill] || 0) >= 15 ? 'high' : 'medium',
        }));
    },
    planSteps() {
      return this.demo.planSteps.map((step, index) => ({
        week: index + 1,
        title: step[0],
        action: index === 2 ? `Build: ${this.recommended.opportunity.portfolio_artifact}` : step[1],
        evidence: step[2],
      }));
    },
    metrics() {
      return [
        { label: 'Fit score', value: `${this.recommended.score}%`, tone: 'green' },
        { label: 'Judge ready', value: `${this.judgeReadiness.overall}%`, tone: 'blue' },
        { label: 'Decision delta', value: `+${this.experiment.decision_delta}`, tone: 'green' },
        { label: 'Risk cut', value: `${this.experiment.risk_reduction}%`, tone: 'amber' },
        { label: 'Final submit', value: this.demo.readiness.finalSubmit ? 'open' : 'gated', tone: 'rose' },
      ];
    },
    evidenceGraph() {
      return this.planData?.evidence_graph || this.demo.evidenceGraph.map(([kind, label, evidence]) => ({
        kind,
        label,
        evidence,
        status: kind === 'control' ? 'required' : 'ready',
      }));
    },
    packet() {
      return {
        title: 'AI Study-to-Work Coach',
        tagline: 'Explainable student pathfinding from study plan to portfolio proof.',
        recommendation: this.recommended.opportunity.title,
        score: this.recommended.score,
        guardrails: this.demo.guardrails,
        gaps: this.gaps,
        buildWindow: '2026-06-14 to 2026-06-21',
      };
    },
  },
  mounted() {
    this.loadGeneratedData();
    this.refreshIcons();
  },
  updated() {
    this.refreshIcons();
  },
  methods: {
    async loadGeneratedData() {
      const [planResponse, readinessResponse, experimentResponse, judgeResponse] = await Promise.allSettled([
        fetch('./src/data/coach_plan.json'),
        fetch('./src/data/readiness_report.json'),
        fetch('./src/data/competitive_experiment.json'),
        fetch('./src/data/judge_readiness.json'),
      ]);
      if (planResponse.status === 'fulfilled' && planResponse.value.ok) {
        const plan = await planResponse.value.json();
        if (plan?.profile?.skills) {
          this.planData = plan;
          this.profile = plan.profile;
        }
      }
      if (readinessResponse.status === 'fulfilled' && readinessResponse.value.ok) {
        const report = await readinessResponse.value.json();
        this.demo.readiness.prod = report.score || this.demo.readiness.prod;
      }
      if (experimentResponse.status === 'fulfilled' && experimentResponse.value.ok) {
        this.experiment = await experimentResponse.value.json();
      }
      if (judgeResponse.status === 'fulfilled' && judgeResponse.value.ok) {
        this.judgeReadiness = await judgeResponse.value.json();
      }
    },
    scoreOpportunity(opportunity) {
      let score = 35;
      const reasons = [];
      const goalsText = this.profile.goals.join(' ').toLowerCase();
      opportunity.signals.forEach((signal) => {
        if (this.profile.interests.includes(signal) || goalsText.includes(signal.toLowerCase())) {
          score += 8;
          reasons.push(`Matches ${signal}.`);
        }
      });
      Object.entries(opportunity.required_skills).forEach(([skill, target]) => {
        const current = this.profile.skills[skill] || 0;
        if (current >= target) {
          score += 6;
          reasons.push(`${skill} ready.`);
        } else if (current + 15 >= target) {
          score += 3;
          reasons.push(`${skill} near target.`);
        } else {
          score -= 4;
          reasons.push(`${skill} needs sprint work.`);
        }
      });
      if (this.profile.constraints.some((item) => item.includes('low-cost'))) score += 4;
      return { opportunity, score: Math.max(0, Math.min(100, score)), reasons };
    },
    updateSkill({ skill, value }) {
      this.profile.skills[skill] = Number(value);
    },
    downloadPacket() {
      const blob = new Blob([JSON.stringify(this.packet, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'usaii-study-to-work-packet.json';
      link.click();
      URL.revokeObjectURL(link.href);
    },
    refreshIcons() {
      this.$nextTick(() => {
        if (window.lucide) window.lucide.createIcons();
      });
    },
  },
};
</script>
