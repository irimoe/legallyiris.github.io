<script setup lang="ts">
const updatedMs = 1740280046 * 1000;
const updated = new Date(updatedMs).toLocaleDateString("en-GB", {
	year: "numeric",
	month: "long",
	day: "numeric",
});
</script>

<template>
  <main class="page">
    <h1>things that i use</h1>
    <div class="last-updated">last updated: {{ updated }}</div>
    <hr />

    <section id="hardware">
      <h2>hardware</h2>
      <ul>
        <li>my phone is a google pixel 7a running on calyxos</li>
        <li>
          my desktop is a modified prebuilt dell optiplex 7010, running with an i5-3470, 16gb of
          ram, and an amd radeon rx 6400.
        </li>
        <li>
          i have two monitors, both 1080p@60hz. one is a dell p2217h and the other is a dell... some
          other model with a weird name.
        </li>
        <li>my keyboard is a keyboard, mouse is a mouse, etc.</li>
      </ul>
    </section>

    <section id="software">
      <h2>software</h2>
      <ul>
        <li>my pc runs nixos with the sway wayland compositor.</li>
        <li>i use the foot terminal emulator with fish.</li>
        <li>i exclusively use the zed text editor.</li>
        <li>i use firefox as my web browser.</li>
      </ul>

      <img
        src="/desktop/screenshot.png"
        alt="screenshot of my desktop with a terminal open on the left and the zed text editor open on the right with the cattpuccin mocha theme and this website's source code open"
      />
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
    margin-bottom: 0.2rem;
    font-size: 0.9rem;
  }
}

img {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid hsla(var(--text) / 0.5);
  margin-top: 1rem;
}
</style>
