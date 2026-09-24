<template>
  <div class="max-w-3xl">
    <h1 class="text-2xl font-semibold mb-4">Service Job Order</h1>
    <form @submit.prevent="submit">
      <!-- I. Customer Information -->
      <section class="mb-4 bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">I. Customer Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input v-model="data.customerName" placeholder="Customer Name" class="border p-2" required />
          <input v-model="data.contact" placeholder="Contact #" class="border p-2" />
          <input v-model="data.address" placeholder="Address" class="border p-2 md:col-span-2" />
          <input v-model="data.email" placeholder="E-mail Address" type="email" class="border p-2" />
        </div>
      </section>

      <!-- II. Unit Information -->
      <section class="mb-4 bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">II. Unit Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input v-model="data.unitType" placeholder="Unit Type" class="border p-2" />
          <input v-model="data.datePurchased" placeholder="Date Purchased" type="date" class="border p-2" />
          <input v-model="data.unitUsername" placeholder="Unit Username" class="border p-2" />

          <input v-model="data.unitBrand" placeholder="Unit Brand" class="border p-2" />
          <input v-model="data.warrantyStatus" placeholder="Warranty Status (In Warranty/Out)" class="border p-2" />
          <input v-model="data.unitPassword" placeholder="Unit Password" class="border p-2" />

          <input v-model="data.unitModel" placeholder="Unit Model" class="border p-2" />
          <input v-model="data.warrantyType" placeholder="Warranty Type" class="border p-2" />
          <input v-model="data.biosPassword" placeholder="BIOS Password" class="border p-2" />

          <input v-model="data.serial" placeholder="Serial" class="border p-2" />
          <input v-model="data.imei" placeholder="IMEI Number" class="border p-2" />
          <div class="flex items-center gap-2 p-2">
            <label class="text-sm">OKay to format?</label>
            <label><input type="radio" v-model="data.okToFormat" value="yes" /> Yes</label>
            <label><input type="radio" v-model="data.okToFormat" value="no" /> No</label>
          </div>
        </div>
      </section>

      <!-- Service Request & Accessories -->
      <section class="mb-4 bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">Service Request</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block"><input type="checkbox" v-model="data.requests" value="Diagnosis Only" /> Diagnosis Only</label>
            <label class="block"><input type="checkbox" v-model="data.requests" value="Hardware Repair" /> Hardware Repair</label>
            <label class="block"><input type="checkbox" v-model="data.requests" value="Software Trouble Shooting" /> Software Trouble Shooting</label>
            <label class="block"><input type="checkbox" v-model="data.requests" value="Warranty Claim" /> Warranty Claim</label>
            <label class="block"><input type="checkbox" v-model="data.requests" value="Other" /> Other</label>
          </div>
          <div>
            <h3 class="font-medium">Accessories</h3>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Power adapter" /> Power adapter/SN</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Power Cord" /> Power Cord</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Bag" /> Bag</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Backpack" /> Backpack</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Sleeve" /> Sleeve</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="VGA" /> VGA</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="HDMI" /> HDMI</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="DP" /> DP</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Monitor Stand" /> Monitor Stand</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Monitor Base Plate" /> Monitor Base Plate</label>
            <label class="block"><input type="checkbox" v-model="data.accessories" value="Others" /> Others</label>
          </div>
        </div>
      </section>

      <!-- Issues and Waiver -->
      <section class="mb-4 bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">III. Unit Issues and Recommendations</h2>
        <textarea v-model="data.issues" class="w-full border p-2" rows="4" placeholder="Unit Issues and Recommendations"></textarea>
      </section>

      <section class="mb-4 bg-white p-4 rounded shadow">
        <h2 class="font-medium mb-2">IV. Service Waiver</h2>
        <label class="block"><input type="checkbox" v-model="data.waiverAccepted" /> I understand and accept the terms of the waiver.</label>
      </section>

      <div class="flex gap-2">
        <button class="bg-brand text-white px-4 py-2 rounded">Submit Service Order</button>
        <button @click.prevent="reset" class="bg-gray-200 px-4 py-2 rounded">Reset</button>
      </div>

      <div v-if="success" class="text-green-700 mt-3">{{ success }}</div>
      <div v-if="error" class="text-red-700 mt-3">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useMainStore } from '../store'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useMainStore()

const defaultData = () => ({
  customerName: '', contact: '', address: '', email: '',
  unitType: '', datePurchased: '', unitUsername: '', unitBrand: '', warrantyStatus: '', unitPassword: '',
  unitModel: '', warrantyType: '', biosPassword: '', serial: '', imei: '', okToFormat: 'no',
  requests: [], accessories: [], issues: '', waiverAccepted: false
})

const data = reactive(defaultData())
const error = ref('')
const success = ref('')

function reset(){ Object.assign(data, defaultData()); error.value=''; success.value='' }

async function submit(){
  error.value = ''
  success.value = ''
  if (!data.customerName) { error.value = 'Customer name is required'; return }
  if (!data.waiverAccepted) { error.value = 'Waiver must be accepted'; return }

  const ticket = {
    type: 'service-order',
    customer: { name: data.customerName, contact: data.contact, address: data.address, email: data.email },
    unit: {
      type: data.unitType, datePurchased: data.datePurchased, username: data.unitUsername,
      brand: data.unitBrand, warrantyStatus: data.warrantyStatus, unitPassword: data.unitPassword,
      model: data.unitModel, warrantyType: data.warrantyType, biosPassword: data.biosPassword,
      serial: data.serial, imei: data.imei, okToFormat: data.okToFormat
    },
    requests: data.requests,
    accessories: data.accessories,
    issues: data.issues,
    createdAt: new Date().toISOString()
  }

  try{
    const saved = await store.submitTicket(ticket)
    success.value = 'Service order submitted. Ticket ID: ' + saved.id
    reset()
    // optionally navigate to ticket management
    router.push({ name: 'TicketManagement' })
  }catch(e){ error.value = 'Failed to submit: ' + String(e) }
}
</script>
