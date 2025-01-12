<template>
  <div class="profile-header" v-if="profile">
    <div class="left-content avatar-container">
      <img class="avatar" src="/avatar.png"/>
      <button class="change-avatar" v-on:click="changeAvatar">
        <i class="bi bi-pencil-fill"></i>
      </button>
    </div>
    <div class="right-content">
      <div class="profile-information">
        <h2 class="prfile-name">{{ profile.name }}</h2>
        <span
            v-if="!isChangeProfileStatus"
            class="profile-status"
            v-on:click="changeProfileStatus"
        >
          <button>
            <i class="bi bi-pencil-fill"></i>
          </button>
          {{ profile.status }}
        </span>
        <span v-else>
          <input class="changeStatus" v-model="profile.status"/>
          <button v-on:click="saveProfileStatus()">
            <i class="bi bi-check"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
  <div v-else>
    Профиль не загрузился
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {useStore} from "vuex";
import ServerHelper from "@/core/helpers/Server.helper";
import Profile from "@/utility/interfaces/profile.interface";
import Self from "@/utility/interfaces/self.interface";

@Options({
  props: {
    username: {
      type: String,
      required: false,
    },
  }
})
export default class ProfileComponent extends Vue {
  username!: string;
  localUsername: string | null = null;
  profileData: Profile | null = null;
  store = useStore();
  isChangeProfileStatus = false;

  serverHelper?: ServerHelper;

  get profile(): Profile | null {
    return this.profileData;
  }

  changeProfileStatus() {
    this.isChangeProfileStatus = !this.isChangeProfileStatus;
  }

  saveProfileStatus() {
    this.isChangeProfileStatus = !this.isChangeProfileStatus;
    this.store.dispatch("addToast", {
      type: "success",
      title: "Уведомление",
      message: "Статус вашего профиля был изменён!",
    });
  }

  changeAvatar() {
    console.log("hello world!");
  }

  async mounted() {
    this.serverHelper = await ServerHelper.getInstance()

    this.localUsername = this.username
    if (!this.username) {
      const self = this.store.getters.self as Self;
      this.localUsername = self.user.login;
    }

    this.profileData = await this.serverHelper.getProfile(this.localUsername);
  }
}
</script>

<style lang="scss">
button:hover {
  background-color: var(--black);
  color: var(--white);
  cursor: pointer;
}

.changeStatus {
  font-size: 1rem;
  padding: 0;
  background-color: transparent;
  border: none;
}

.profile-header {
  display: flex;

  .left-content {
    .avatar {
      width: 10vh;
      height: 10vh;
      max-height: 200px;
      max-width: 200px;
      display: block;
    }
  }

  .avatar-container {
    position: relative;

    .change-avatar {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #333, $alpha: 0.5);
      font-size: 1.5rem;
      padding: 0;
      border: none;
      outline: none;
      color: var(--white);
      opacity: 0;
      transition: .3s;
    }

    .change-avatar:hover {
      opacity: 1;
    }
  }

  .right-content {
    flex: 1;
    text-align: left;
    margin-left: 1rem;

    .profile-information {
      .prfile-name {
        margin: 0;
        font-size: 1.5rem;
      }

      .profile-status {
        font-size: 1rem;
      }

      .profile-status:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
