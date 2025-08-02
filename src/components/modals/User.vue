<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="850"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-space-between align-center">
          <h5>Edit User Info</h5>
          <v-btn icon @click="handleCloseModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mt-10">
          <v-form ref="form" v-model="formValid">
            <v-row class="d-flex" style="gap: 20px;">
              <div style="width: 300px">
                <div class="d-flex flex-column align-center" >
                  <v-img
                  :src="user.avatar || 'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                  class="mb-4"
                  width="150"
                  ></v-img>
                  <v-text-field
                    v-model="user.username"
                    label="Username"
                    outlined
                    dense
                    style="width: 100%;"
                    :rules="[rules.required]"
                  ></v-text-field>  
                  <v-text-field
                    v-model="user.password"
                    :type="show_password ? 'text' : 'password'"
                     outlined
                    label="Password"
                    dense
                    style="width: 100%;"
                    hide-details="auto"
                    :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show_password = !show_password"
                    :rules="[rules.required]"
                  ></v-text-field>
                </div> 
              </div>
              <div style="flex: 1;">
                <div class="d-flex flex-row align-center" style="gap: 20px;">
                  <v-text-field
                    v-model="user.first_name"
                    label="First Name"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.last_name"
                    label="Last Name"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                </div> 
                <div class="d-flex flex-row align-center" style="gap: 20px;">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    outlined
                    dense
                    :rules="[rules.email]"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.phone"
                    label="Phone"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                </div> 
                <div class="d-flex flex-row align-center" style="gap: 20px;">
                   <v-select
                    :items="role_option"
                    outlined
                    required
                    dense
                    v-model="user.role"
                    style="text-transform: capitalize;width: inherit;"
                    label="Role"
                ></v-select>
                </div> 
                <div class="d-flex flex-row align-center" style="gap: 20px;">
                    <v-textarea
                    name="input-7-1"
                    outlined
                    v-model="user.address"
                    label="Address"
                    hide-details="auto"
                    auto-grow
                    class="mb-4"
                  ></v-textarea>
                </div> 
              </div>
            </v-row>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveUserInfo" :loading="submitLoading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      show_modal: {
        type: Boolean,
        default: false,
      },
      user_data: {
        type: Object,
        required: true,
      }
    },
    data () {
      return {
        role_option: ['admin', 'user','owner'],
        dialog: false,
        formValid: false,
        submitLoading: false,
        show_password: false,
        user: {
          id:'',
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          phone: '',
          address: '',
          role: 'user',
        },
        rules: {
          required: v => !!v || 'This field is required',
          email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        }
      }
    },
    watch: {
      show_modal (val) {
        this.dialog = val
        if (val && this.user_data) {
          this.user = { ...this.user_data }
        }
      },
    },
    methods: {
      handleCloseModal () {
        this.dialog = false
        this.$refs.form.reset()
        this.$emit('closeModal', false)
      },
      fetchUsers () {
        this.$emit('handleGetUsers')
      },
      saveUserInfo () {
        if (this.$refs.form.validate()) {
          this.$notiflix.Loading.arrows();
          this.submitLoading = true;
          this.axios.post(`/user`,this.user).then((res)=>{
              if(res.status){
                this.$awn.success(`${this.user.id ? 'User Info Updated' : 'New User Addedd'} Successfully`);
                this.handleCloseModal()
                this.fetchUsers()
              }
          }).catch((error)=>{
              console.log(error,'error')
          }).finally(()=>{
              this.submitLoading = false;
              this.$notiflix.Loading.remove();
          })
        }
      }
    },
  }
</script>

