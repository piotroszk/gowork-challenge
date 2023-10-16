<template>
  <v-form ref="jobForm" v-model="valid" @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.first_name" :rules="nameRules" :counter="10" label="First name" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.last_name" :rules="nameRules" :counter="10" label="Last name" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.email" :rules="emailRules" label="E-mail" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.phone" :rules="phoneRules" label="Phone" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-file-input @change="onFileChange" :rules="fileRules" required label="CV" small-chips truncate-length="15"></v-file-input>
        </v-col>
        <v-col cols="12">
          <v-btn color="blue lighten-2" dark class="float-end" type="submit">Submit</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const valid = ref(false)
const props = defineProps({
  jobId: String
})
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})
const nameRules = ref([
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length <= 10 || 'Name must be less than 10 characters'
])
const emailRules = ref([
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+/.test(v) || 'E-mail must be valid'
])
const phoneRules = ref([
  (v: string) => !!v || 'Phone is required',
  (v: string) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v) || 'Phone must be valid'
])
const fileRules = ref([
  (v: string) => !!v || 'File is required'
])
let cv_file_id: any = null

const jobForm = ref<HTMLFormElement | null>(null)

const submit = async () => {
  jobForm?.value?.validate()
  if (valid.value) {
    try {
      const response = await fetch(`https://6082be765dbd2c001757a628.mockapi.io/api/v1/jobs/${props.jobId}/applications`, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.value.email,
          first_name: formData.value.first_name,
          last_name: formData.value.last_name,
          phone: formData.value.phone,
          cv_file_id
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })

      if (!response.ok) {
        // Handle HTTP error status codes
        if (response.status === 400) {
          const responseData = await response.json()
          console.error('Validation error:', responseData)
          alert('Validation error: ' + responseData.message)
        }
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.')
    }
  }
}

const onFileChange = (event: any) => {
  const fileData = event?.target?.files[0]
  cv_file_id = fileData?.name
}
</script>

