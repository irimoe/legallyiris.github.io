<script setup lang="ts">
const updatedMs = 1736022517 * 1000
const updated = new Date(updatedMs).toLocaleDateString('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
</script>

<template>
  <main class="page">
    <h2>things that i use</h2>
    <div class="last-updated">last updated: {{ updated }}</div>
    <hr />

    <section id="hardware">
      <h3>hardware</h3>
      <ul>
        <li>my phone is a google pixel 7a running on calyxos</li>
        <li>
          my desktop is a modified prebuilt dell optiplex 7010, running with an i5-3470, 16gb of
          ram, and an amd radeon rx 6400. it runs arch linux with the niri wayland compositor.
        </li>
        <li>
          i have two monitors, both 1080p@60hz. one is a dell p2217h and the other is a dell... some
          other model with a weird name.
        </li>
        <li>my keyboard is a keyboard, mouse is a mouse, etc.</li>
      </ul>
    </section>
  </main>
</template>

<style scoped lang="scss">
.last-updated {
  font-size: 0.75rem;
  color: hsla(var(--text) / 0.5);
}

h3 {
  font-size: 1.25rem;
}

ul {
  padding: 0 0 0 1rem;
  li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
