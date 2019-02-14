<template>
  <v-app>
    <v-content>
      <Interface/>
    </v-content>
  </v-app>
</template>

<script>
import Interface from './components/Interface'

export default {
  name: 'App',
  components: {
    Interface
  },
  data () {
    return {
      //
    }
  }
}
</script>
