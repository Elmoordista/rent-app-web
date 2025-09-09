<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="600"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-space-between align-center">
          <h5>Item</h5>
          <v-btn icon @click="handleCloseModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mt-4 px-4">
          <v-form ref="form" v-model="formValid">
             <v-autocomplete
              :items="categories"
              v-model="payload.category_id"
              outlined
              required
              dense
              hide-details="auto"
              class="mb-4"
              :rules="handleValidation('Category')"
              style="text-transform: capitalize;"
              label="Category"
            ></v-autocomplete>
            <v-text-field
              v-model="payload.name"
              label="Item Name"
              class="mb-4"
              required
              dense
              :rules="handleValidation('Item Name')"
              outlined
              hide-details="auto"
            ></v-text-field>
            <div class="mb-4">
                <input
                    type="file"
                    ref="file_input"
                    multiple
                    class="d-none"
                    accept="image/*"
                    @change="getFiles"
                />
                <div class="mb-2 d-flex align-center justify-space-between">
                  <span style="color: black;">Images</span>
                  <v-btn color="primary" text small @click="handleSelectFile">
                    Upload
                    <v-icon class="ms-2" size="18">mdi-plus-circle</v-icon>
                  </v-btn>
                </div>
                <div v-if="payload.images.length > 0" class="d-flex flex-wrap align-center" style="gap:10px; width: fit-content;">
                  <template v-for="(image, index) in payload.images">
                    <div v-if="!image.deleted" :key="index" style="position: relative;">
                       <span 
                          style="position: absolute; top: -12px; right: -8px; z-index: 999; border-radius: 10px; cursor: pointer;"
                          @click="handleRemoveImage(index)">
                          <v-icon size="16" color="red">mdi-close-circle</v-icon>
                        </span>
                      <v-img 
                        :src="image.id === undefined ? image.file_path : image.image_url"
                        style="width: 100px; max-width: 100px; object-fit: contain; height: fit-content;"
                        ></v-img>
                    </div>

                  </template>
                </div>
                <div v-if="payload.images.length == 0" class="d-flex flex-wrap justify-center">
                  <span style="color: red;">No images selected</span>
                </div>
            </div>
             <v-textarea
              name="input-7-1"
              outlined
              label="Description"
              hide-details="auto"
              v-model="payload.description"
              auto-grow
              class="mb-4"
              value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            ></v-textarea>
            <div class="d-flex" style="gap:10px">
              <v-select
                :items="status_option"
                v-model="payload.status"
                outlined
                required
                dense
                hide-details="auto"
                :rules="handleValidation('Status')"
                style="text-transform: capitalize; width: 50%;"
                label="Status"
              ></v-select>
               <v-text-field
                v-model="payload.price_per_day"
                label="Price Per Day"
                class="mb-4"
                required
                dense
                :rules="handleValidation('Item Name')"
                outlined
                style="width: 50%;"
                hide-details="auto"
              ></v-text-field>
            </div>
             <div class="d-flex" style="gap:10px">
               <v-text-field
                v-model="payload.available"
                label="Available"
                class="mb-4"
                required
                dense
                :rules="handleValidation('Item Name')"
                outlined
                style="width: 50%;"
                hide-details="auto"
              ></v-text-field>
               <v-autocomplete
                :items="owners"
                v-model="payload.owner_id"
                outlined
                required
                dense
                hide-details="auto"
                :rules="handleValidation('Status')"
                style="text-transform: capitalize; width: 50%;"
                label="Owner"
              ></v-autocomplete>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="grey lighten-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveUserInfo" :loading="submitLoading">{{payload.id ? 'Update' : 'Save'}}</v-btn>
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
      item_selected:{
        type: Object,
        default: null,
      },
      categories:{},
    },
    data () {
      return {
        submitLoading : false,
        status_option: ['active', 'inactive'],
        dialog: false,
        fileRequire: ["image"],
        owners: [],
        formValid: false,
        show_password: false,
        payload: {
          category_id:'',
          name: '',
          description: '',
          images: [],
          status: 'active',
          price_per_day: 0,
          available: 0,
          owner_id:'',
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
        if(newValue){
          const newVals = {...newValue}
          this.payload = {
              id : newVals.id,
              name : newVals.name,
              category_id : newVals.category_id,
              description : newVals.description,
              status : newVals.status,
              images : newVals.images,
              price_per_day : newVals.price_per_day,
              available : newVals.available,
              owner_id : newVals.owner_id,
          };
           console.log(this.payload,'this.payload')
        }
      }
    },
    mounted(){
      this.handleGetOwners();
    },
    methods: {
      handleRemoveImage(index) {
        const oldImage = this.payload.images;
        oldImage[index]['deleted'] = true;
        this.payload.images = [];
        this.payload.images = oldImage;
      },
      handleSelectFile() {
        this.$refs.file_input.click();
      },
      getFiles(event) {
          var input = event.target;
          if (input.files) {
              Object.values(input.files).forEach(function (dataFile) {
              var split = dataFile["type"].split("/");
              if (this.fileRequire.includes(split[0])) {
                  if (dataFile["size"] <= 15000000) {
                      var data = {
                          file_type: dataFile["type"],
                          file_size: dataFile["size"],
                          file_name: dataFile["name"],
                      };
                      var reader = new FileReader();
                      reader.onload = (e) => {
                          data["file_path"] = e.target.result;
                          this.payload.images.push(data);
                      };
                      reader.readAsDataURL(dataFile);
                  } else {
                      this.$awn.error(`The file ${dataFile['name']} too large for the 15MB limit`)
                  }
              } else {
                  this.$awn.error(`Unsuforted File ${dataFile['name']}`)
              }
              }, this);
              // }
          }
      },
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
        this.payload = {
          category_id:'',
          name: '',
          description: '',
          images: [],
          status: 'active',
          price_per_day: 0,
          available: 0,
          owner_id:'',
        };
        this.formValid = false
      },
      saveUserInfo () {
        if (this.$refs.form.validate()) {
          if(this.payload.images.length == 0){
            this.$awn.warning('Please select at least one image');
            return;
          }
          else{
            this.handleSaveitems()
          }
        }
      },
      handleGetOwners(){
        this.$notiflix.Loading.arrows();
        this.axios.get(`/user?type=owner&all=true`,this.items).then((res)=>{
            if(res.status){
              this.owners = res.data.data?.map((item)=>{
                return {
                  value:item.id,
                  text:item.full_name,
                }
              })
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.$notiflix.Loading.remove();
        })
      },
      handleSaveitems () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.post(`/items`,this.payload).then((res)=>{
            if(res.status){
              this.$awn.success(`Item ${this.payload.id ? 'Updated' : 'Saved'} Successfully`);
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

