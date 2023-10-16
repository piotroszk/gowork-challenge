<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card-title class="text-h6 text-md-h5 text-lg-h4">Job offers</v-card-title>

      <v-text-field
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        v-model="search"
      ></v-text-field>

      <v-list>
        <client-only>
          <v-list-item class="list-item"
                       v-for="jobOffer in jobs?.items"
                       :key="jobOffer.id"
                       @click="setActiveJob(jobOffer.id)"
          >
            <div class="d-flex justify-space-between flex-fill">
              <span>{{ jobOffer.title }} {{ jobOffer.company }}</span>
              <span>{{ jobOffer.location }}, {{ jobOffer.location_state }}</span>
            </div>
          </v-list-item>
        </client-only>
      </v-list>

      <JobDetails v-if="activeJob" :job="activeJob" />

      <v-pagination
        v-if="jobs && jobs?.count > 10"
        class="mt-6"
        :length="pageCount"
        :total-visible="7"
        v-model="currentPage"
      ></v-pagination>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { Job, Jobs } from '@/types/jobs'
import JobDetails from '@/components/JobDetails.vue'

const activeJob = ref<Job | null>(null)
const currentPage = ref(1)
const jobs = ref<Jobs | null>(null)
const search = ref<string | null>(null)

const pageCount = computed(() => {
  const pageLimit = 10
  const totalCount = jobs.value?.count || 0
  return Math.floor(totalCount / pageLimit)
})

const fetchJobs = async (pageNumber: number) => {
  try {
    const response = await fetch(`https://6082be765dbd2c001757a628.mockapi.io/api/v1/jobs?page=${pageNumber}&limit=10`)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`)
    }

    const data = await response.json()
    jobs.value = data
  } catch (error) {
    console.error('An error occurred while fetching jobs:', error)
  }
}

const setActiveJob = async (jobId: string) => {
  try {
    const response = await fetch(`https://6082be765dbd2c001757a628.mockapi.io/api/v1/jobs/${jobId}`)

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`)
    }

    const data = await response.json()
    activeJob.value = data
  } catch (error) {
    console.error('An error occurred while fetching the active job:', error)
  }
}

let _timerId: NodeJS.Timeout | null = null
const fetchEntriesDebounced = (val: string | null) => {
  if (_timerId) {
    clearTimeout(_timerId)
  }

  try {
    _timerId = setTimeout(async () => {
      const response = await fetch(`https://6082be765dbd2c001757a628.mockapi.io/api/v1/jobs?page=1&limit=10&search=${val}`)

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
      }

      const data = await response.json()
      jobs.value = data
    }, 500)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

watch(currentPage, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    fetchJobs(newVal)
  }
})

watch(search, (val: string | null) => {
  fetchEntriesDebounced(val)
})

onMounted(() => {
  fetchJobs(1)
})

</script>

<style lang="scss">
.list-item {
  cursor: pointer;
  &:hover {
    background-color: #ffe;
  }
}
</style>
