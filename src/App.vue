<template>
  <v-app>
    <v-toolbar app>
      <!-- <v-btn icon v-if="$route.name !== 'ControllerPage'" @click="$router.go(-1) ">
        <v-icon>arrow_back</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-title >
        <span>CropChien</span>
      </v-toolbar-title>-->
      <v-toolbar-side-icon @click="handleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title>PetDrinker</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-navigation-drawer app mini-variant v-model="drawer">
      <v-list dense>
        <v-list-tile avatar :key="key" v-for="(item , key) in items" @click="$router.push({ name: item.pathName})">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container grid-list-md text-xs-center>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import Home from './components/Home'
import ControllerPage from "./components/ControllerPage";
// import SetupPage from "./components/SetupPage";
export default {
  name: "App",
  components: {
    ControllerPage
  },
  data() {
    return {
      drawer: false,
      items: [
        {
          title: "Home",
          icon: "dashboard",
          pathName:"controllerPage"
        },
        {
          title: "About",
          icon: "settings",
          pathName:"setupPage"
        }
      ],
      settingLink: "https://localhost/weasdsd/asdas/"
    };
  },
  methods: {
    handleDrawer: function() {
      this.drawer = !this.drawer;
      console.log(this.drawer);
    }
  }
};
</script>