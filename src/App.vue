<template>
  <div id="app">
    <tax-calculator></tax-calculator>
  </div>
</template>

<script>
import TaxCalculator from '@/components/TaxCalculator';

export default {
  name: 'app',
  components: { TaxCalculator }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin: 60px auto 0;
}
</style>
