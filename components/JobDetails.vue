<template>
  <div v-if="job?.id" class="my-6 pa-6 border-dotted">
    <strong>Title: </strong>{{ job.department }}<br>
    <strong>Company: </strong>{{ job.company }}<br>
    <strong>Department: </strong>{{ job.department }}<br>
    <strong>Description: </strong>{{ job.description }}<br>
    <strong>Location: </strong>{{ job.location }}<br>
    <strong>Location state: </strong>{{ job.location_state }}<br>
    <strong>Salary: </strong>{{ job.salary }} {{ job.salary_currency }}<br>

    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn
          class="mt-6"
          color="blue lighten-2"
          dark
          v-bind="props"
          @click="dialog = true"
        >
          Apply
        </v-btn>
      </template>

      <v-card>
        <JobApplicationForm :job-id="job.id" />
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JobApplicationForm from './JobApplicationForm.vue'
import { Job } from '@/types/jobs'

const props = defineProps({
  job: {
    type: Object as () => Job | null,
    required: true
  }
})

const dialog = ref(false)
</script>


