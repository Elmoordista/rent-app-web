<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="900"
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
           <div class="d-flex gap-4  flex-column mb-4" style="border: 1px solid #E0E0E0; border-radius: 8px; padding: 10px; gap: 10px;">
              <!-- Sizes & Colors Switch -->
              <v-switch
                hide-details
                v-model="payload.has_sizes_color_options"
                label="Enable size & color options"
                inset
                color="indigo"
                class="mt-2"
              >
                <template v-slot:label>
                  <v-icon size="20" color="indigo" class="mr-2">mdi-palette</v-icon>
                  Enable size & color options
                </template>
              </v-switch>

              <!-- Driver License Switch -->
              <v-switch
                hide-details
                v-model="payload.need_driver_license"
                label="Need driver license"
                inset
                color="deep-orange"
                class="mt-2"
              >
                <template v-slot:label>
                  <v-icon size="20" color="deep-orange" class="mr-2">mdi-card-account-details</v-icon>
                  Require driver license
                </template>
              </v-switch>

            </div>

             <input
                    type="file"
                    ref="file_input"
                    multiple
                    class="d-none"
                    accept="image/*"
                    @change="getFiles"
                />

            <div v-if="payload.has_sizes_color_options" class="mb-4">
                <v-card outlined>
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th class="text-left">Image</th>
                        <th class="text-left">Size</th>
                        <th class="text-left">Color</th>
                        <th class="text-left">Quantity</th>
                        <th class="text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, index) in payload.sizes_colors"
                        :key="index"
                      >
                      <template v-if="!row.is_deleted || row.is_deleted == undefined">
                        <td>
                          <v-img @click="handleClickImage(index)"
                            v-if="row.file_path || row.image_url != undefined"
                            :src="row.file_path ? row.file_path : row.image_url"
                            style="width: 70px; max-width: 70px; object-fit: contain; height: fit-content;"
                          ></v-img>
                          <div class="no-image" v-else @click="handleClickImage(index)">
                            <small>No Image</small>
                            <small>click to upload</small>
                          </div>
                        </td>
                        <td>
                          <v-text-field
                            v-model="row.size"
                            :disabled="!payload.has_sizes_color_options"
                            dense
                            outlined
                            :rules="handleValidation('Size')"
                            hide-details
                            placeholder="Enter size"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model="row.color"
                            :disabled="!payload.has_sizes_color_options"
                            dense
                            :rules="handleValidation('Color')"
                            outlined
                            hide-details
                            placeholder="Enter color"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="row.quantity"
                            :disabled="!payload.has_sizes_color_options"
                            type="number"
                            dense
                            outlined
                            @input="handleUpdateAvailable()"
                            @keydown="isNumber($event)"
                            hide-details="auto"
                            placeholder="Enter qty"
                          />
                        </td>
                        <td>
                          <v-btn
                            icon
                            color="red"
                            @click="removeRow(index, row)"
                            :disabled="!payload.has_sizes_color_options"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </template>
                      </tr>
                    </tbody>
                  </v-simple-table>
                  <v-card-actions style="background-color: #f5f5f5; margin-top: 10px;">
                    <v-btn
                      color="primary"
                      text
                      @click="addRow"
                      :disabled="!payload.has_sizes_color_options"
                    >
                      Add Row
                      <v-icon class="ms-2" size="18">mdi-plus-circle</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
            </div>
  
            <div class="mb-4" v-else>
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
                 @keydown="isNumber($event)"
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
                 @keydown="isNumber($event)"
                :readonly="payload.has_sizes_color_options"
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
        selected_row: null,
        payload: {
          category_id:'',
          name: '',
          has_sizes_color_options: false,
          need_driver_license: false,
          description: '',
          images: [],
          status: 'active',
          price_per_day: 0,
          available: 0,
          owner_id:'',
          sizes_colors: [
            { 
              id: null,
              file_path: null,
              size: "", 
              color: "", 
              quantity: 0 
            }
          ],
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
      'payload.sizes_colors'(newValue) {
          let totalQty = 0;
          console.log(newValue);
          newValue.forEach((item)=>{
            totalQty += parseInt(item.quantity);
          })
          this.payload.available = totalQty;
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
              has_sizes_color_options: newVals.has_sizes_color_options ? newVals.has_sizes_color_options ? true : false : false,
              need_driver_license: newVals.need_driver_license ? newVals.need_driver_license ? true : false : false,
              sizes_colors : newVals.variations && newVals.variations.length > 0 ? newVals.variations.map((item)=>{
                return {
                  id: item.id,
                  image_url: item.image_url,
                  file_path: null,
                  size: item.size,
                  color: item.color,
                  quantity: item.quantity,
                }
              }) : [{ size: "", color: "", quantity: 0 }],
          };
        }
      }
    },
    mounted(){
      this.handleGetOwners();
    },
    methods: {
      isNumber(e){
          const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
          const keyPressed = e.key;

          if (!keysAllowed.includes(keyPressed)) {
              e.preventDefault()
          }
      },
      handleUpdateAvailable(){
          let totalQty = 0;
          this.payload.sizes_colors.forEach((item)=>{
            totalQty += parseInt(item.quantity);
          })
          this.payload.available = totalQty;
      },
      addRow() {
        this.payload.sizes_colors.push(
          { 
            id: null,
            file_path: null,
            size: "",
            color: "", 
            quantity: 0 });
      },
      removeRow(index, row) {
        if(row.id){
          const oldSizesColors = this.payload.sizes_colors;
          oldSizesColors[index]['is_deleted'] = true;
          this.payload.sizes_colors = [];
          this.payload.sizes_colors = oldSizesColors;
        }
        else{
          this.payload.sizes_colors.splice(index, 1);
        }
      },
      handleRemoveImage(index) {
        const oldImage = this.payload.images;
        oldImage[index]['deleted'] = true;
        this.payload.images = [];
        this.payload.images = oldImage;
      },
      handleClickImage(index) {
        this.selected_row = index;
        this.$refs.file_input.click();
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
                     if(this.selected_row !== null && this.payload.has_sizes_color_options){
                        var reader = new FileReader();
                        reader.onload = (e) => {
                            this.payload.sizes_colors[this.selected_row]['file_path'] = e.target.result;
                            this.selected_row = null;
                        };
                        reader.readAsDataURL(dataFile);
                      }else{
                          var datas = {
                              file_type: dataFile["type"],
                              file_size: dataFile["size"],
                              file_name: dataFile["name"],
                          };
                          var readerFile = new FileReader();
                          readerFile.onload = (e) => {
                              datas["file_path"] = e.target.result;
                              this.payload.images.push(datas);
                          };
                          readerFile.readAsDataURL(dataFile);
                      }

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
          has_sizes_color_options: false,
          need_driver_license: false,
          sizes_colors: [
            { 
              id: null,
              file_path: null,
              size: "", 
              color: "", 
              quantity: 0 
            }
          ],
        };
        this.formValid = false
      },
      saveUserInfo () {
        if (this.$refs.form.validate()) {
          if(this.payload.images.length == 0 && !this.payload.has_sizes_color_options){
            this.$awn.warning('Please select at least one image');
            return;
          }
          else if (this.payload.has_sizes_color_options){
            let valid = true;
            this.payload.sizes_colors.forEach((item)=>{
              if(!item.size || !item.color || item.quantity == 0 || (!item.file_path && !item.id)){
                valid = false;
              }
            })
            if(!valid){
              this.$awn.warning('Please fill all size & color options fields && select image');
              return;
            }
            else{
              this.handleSaveitems()
            }
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

<style >
.no-image{
  margin-top: 2px;
  width: 100px; 
  max-width: 100px; 
  height: 50px; 
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  border: 1px dashed #BDBDBD; 
  border-radius: 4px; 
  color: #BDBDBD;
  cursor: pointer;
}
</style>

