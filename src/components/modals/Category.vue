<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-space-between align-center">
          <h5>Category</h5>
          <v-btn icon @click="handleCloseModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mt-4 px-4">
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="category.name"
              label="Category Name"
              class="mb-4"
              required
              :rules="handleValidation('Category Name')"
              outlined
              hide-details="auto"
            ></v-text-field>
             <v-textarea
              name="input-7-1"
              outlined
              label="Description"
              hide-details="auto"
              v-model="category.description"
              auto-grow
              class="mb-4"
              value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            ></v-textarea>
             <v-select
              :items="status_option"
              v-model="category.status"
              outlined
              required
              :rules="handleValidation('Status')"
              style="text-transform: capitalize;"
              label="Status"
            ></v-select>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="grey lighten-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveUserInfo" :loading="submitLoading">{{category.id ? 'Update' : 'Save'}}</v-btn>
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
      item_selected:{}
    },
    data () {
      return {
        submitLoading : false,
        status_option: ['active', 'inactive'],
        dialog: false,
        formValid: false,
        show_password: false,
        category: {
          id:'',
          name: '',
          description: '',
          status: 'active',
          owner: '',
        },  
        rules: {
          required: v => !!v || 'This field is required',
          email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        }
      }
    },
    watch: {
      'show_modal'(newValue) {
        this.dialog = newValue;
      },
      'item_selected'(newValue) {
        this.category = {
            id : newValue.id,
            name : newValue.name,
            description : newValue.description,
            status : newValue.status
        };
      }
    },
    methods: {
      handleValidation(name){
          return [
              v => !!v || `${name} is required`,
          ];
      },
      handleCloseModal () {
        this.resetForm();
        this.dialog = false
        this.$refs.form.reset()
        this.$emit('closeModal', false)
      }, 
      fetchRecords () {
        this.$emit('fetchRecords')
      },
      resetForm () {
        this.category = {
          id: '',
          name: '',
          description: '',
          status: 'active',
        }
        this.formValid = false
      },
      saveUserInfo () {
        if (this.$refs.form.validate()) {
         this.handleSaveCategory()
        }
      },
      handleSaveCategory () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.post(`/category`,this.category).then((res)=>{
            if(res.status){
              this.$awn.success(`Category ${this.category.id ? 'Updated' : 'Saved'} Successfully`);
              this.handleCloseModal()
              this.fetchRecords();
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      }
    },
  }
</script>

