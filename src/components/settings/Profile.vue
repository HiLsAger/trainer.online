<template>
  <div class="profile-header">
    <div class="left-content avatar-container">
      <img class="avatar" src="/avatar.png" />
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
          {{ profileStatus }}
        </span>
        <span v-else>
          <input class="changeStatus" v-model="profileStatus" />
          <button v-on:click="saveProfileStatus()">
            <i class="bi bi-check"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/utility/interfaces/SelfInterface";
import { Vue } from "vue-class-component";
import { useStore } from "vuex";

export default class ProfileComponent extends Vue {
  store = useStore();
  profileStatus = "я не я когда я";
  isChangeProfileStatus = false;

  get profile(): User {
    return this.store.getters.profile;
  }
  changeProfileStatus() {
    this.isChangeProfileStatus = !this.isChangeProfileStatus;
  }

  saveProfileStatus() {
    this.isChangeProfileStatus = !this.isChangeProfileStatus;
    this.store.dispatch("addToast", {
      type: "success",
      title: "Уведомление",
      message: "Статус успешно обновлён",
    });
  }

  changeAvatar() {
    console.log("hello world!");
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
    .change-avatar:hover{
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
