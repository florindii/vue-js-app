<template>
  <div class="loading">
    <img src="../../assets/images/tilia_loader.svg" alt="Loading..." />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.loading {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($color: #000000, $alpha: 0.4);
}
</style>
