<template>
  <div class="hello">
    <l-map
      class="map"
      ref="map"
    ></l-map>
  </div>
</template>

<script>
  import LMap from './LeafletMap.vue';

  export default {
    name: 'HelloWorld',
    data() {
      return {
      }
    },
    mounted() {
      this.map = this.$refs.map;
      this.map.renderChinaPolygon();
    },
    components: {
      'l-map': LMap
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width: 100%;
    height: 100%;
  }
  .map {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
