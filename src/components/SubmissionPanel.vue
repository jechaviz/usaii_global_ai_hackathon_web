<template>
  <section class="panel submission-panel">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">Submission Packet</p>
        <h2>{{ packet.title }}</h2>
      </div>
      <i data-lucide="file-check-2"></i>
    </div>

    <dl class="packet-list">
      <div>
        <dt>Qualifier</dt>
        <dd>{{ readiness.qualifier }}</dd>
      </div>
      <div>
        <dt>Team gate</dt>
        <dd>{{ readiness.studentGate }}</dd>
      </div>
      <div>
        <dt>Build window</dt>
        <dd>{{ packet.buildWindow }}</dd>
      </div>
      <div>
        <dt>Deadline</dt>
        <dd>{{ readiness.deadline }}</dd>
      </div>
    </dl>

    <div class="packet-callout">
      <strong>{{ packet.recommendation }}</strong>
      <span>{{ packet.tagline }}</span>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    packet: { type: Object, required: true },
    readiness: { type: Object, required: true },
  },
};
</script>
