<template>
  <div class="max-w-4xl mx-auto bg-slate-50 p-6 rounded shadow">
    <header class="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-800 to-blue-700 text-white rounded">
      <div class="flex items-center gap-3">
        <div class="text-2xl font-bold">JONECOTECH</div>
        <div class="text-sm opacity-80">Service Job Order</div>
      </div>
      <div class="text-sm">Invoice: <span class="font-medium">{{ form.invoiceNumber || '—' }}</span></div>
    </header>

    <div class="mb-4 text-slate-700">Step {{ step }} / 4</div>

    <!-- Step 1: Customer Information -->
    <div v-if="step===1" class="grid grid-cols-1 gap-2 bg-white p-4 rounded border">
      <label class="block">Invoice Number</label>
      <div class="flex gap-2">
        <input v-model="form.invoiceNumber" class="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter invoice number" @keyup.enter="validateInvoiceNumber" />
        <button @click="validateInvoiceNumber" type="button" class="bg-slate-800 text-white px-3 py-2 rounded">Validate</button>
      </div>
      <div v-if="invoiceValidated" class="text-sm text-green-600">Invoice validated. You can continue.</div>
      <div v-if="invoiceError" class="text-sm text-red-600">{{ invoiceError }}</div>
      <label class="block">Customer Name</label>
      <input v-model="form.customerName" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
      <label class="block">Contact #</label>
      <input v-model="form.contact" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
      <label class="block">Address</label>
      <input v-model="form.address" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
      <label class="block">E-mail Address</label>
      <input v-model="form.email" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
    </div>

    <!-- Step 2: Unit Information -->
    <div v-if="step===2" class="grid grid-cols-1 gap-2 bg-white p-4 rounded border">
      <label class="block">Unit Type</label>
      <input v-model="form.unitType" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block">Unit Brand</label>
          <input v-model="form.unitBrand" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div>
          <label class="block">Unit Model</label>
          <input v-model="form.unitModel" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block">Serial</label>
          <input v-model="form.serial" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div>
          <label class="block">IMEI / Number</label>
          <input v-model="form.imei" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block">Date Purchased</label>
          <input type="date" v-model="form.datePurchased" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div>
          <label class="block">Warranty Status</label>
          <select v-model="form.warrantyStatus" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="In Warranty">In Warranty</option>
            <option value="Out of Warranty">Out of Warranty</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block">Unit Username</label>
          <input v-model="form.unitUsername" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <div>
          <label class="block">Unit Password</label>
          <input v-model="form.unitPassword" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </div>
    </div>

    <!-- Step 3: Service Request & Accessories -->
    <div v-if="step===3" class="grid grid-cols-1 gap-2 bg-white p-4 rounded border">
      <div>
        <label class="block font-semibold">Service Request</label>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <label><input type="checkbox" v-model="form.request.diagnosis" /> Diagnosis Only</label>
          <label><input type="checkbox" v-model="form.request.hardware" /> Hardware Repair</label>
          <label><input type="checkbox" v-model="form.request.software" /> Software Trouble Shooting</label>
          <label><input type="checkbox" v-model="form.request.warrantyClaim" /> Warranty Claim</label>
          <label class="col-span-2"><input type="checkbox" v-model="form.request.other" /> Other: <input v-model="form.request.otherText" class="ml-2 border p-1 rounded" /></label>
        </div>
      </div>

      <div class="mt-2">
        <label class="block font-semibold">Accessories</label>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.powerAdapter" class="mr-2"/> Power adapter / SN</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.powerCord" class="mr-2"/> Power Cord</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.bag" class="mr-2"/> Bag</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.backpack" class="mr-2"/> Backpack</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.sleeve" class="mr-2"/> Sleeve</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.vga" class="mr-2"/> VGA</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.hdmi" class="mr-2"/> HDMI</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.dp" class="mr-2"/> DP</label>
          <label class="text-sm"><input type="checkbox" v-model="form.accessories.others" class="mr-2"/> Others</label>
        </div>
      </div>
    </div>

    <!-- Step 4: Issues, Recommendations, Waiver -->
    <div v-if="step===4" class="grid grid-cols-1 gap-2 bg-white p-4 rounded border">
      <label class="block">Unit Issues / Description</label>
      <textarea v-model="form.issues" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" rows="4"></textarea>
      <label class="block mt-2">Recommendation/s (optional)</label>
      <textarea v-model="form.recommendations" class="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200" rows="2"></textarea>

      <div class="mt-2">
        <button @click="showWaiver = !showWaiver" class="text-sm text-slate-700 underline">{{ showWaiver ? 'Hide' : 'View' }} Service Waiver and Terms</button>
      </div>

      <div v-if="showWaiver" class="mt-2 p-3 border rounded bg-gray-50 max-h-60 overflow-auto text-sm text-slate-700">
        <strong>Service Waiver and Terms</strong>
        <ol class="list-decimal ml-5 mt-2">
          <li><strong>Void of Warranty:</strong> If signs of tampering, misuse, or damage caused by corrosion, heat, moisture, vibration, infestation or mishandling are found, the unit's warranty may be voided.</li>
          <li><strong>Loss of Data:</strong> Prior to submitting for Warranty Service, create a backup of all data and remove any security passwords. Safeguarding your information is your responsibility.</li>
          <li><strong>Contents of Unit:</strong> Memory cards and storage media may be reformatted during service.</li>
          <li><strong>Warranty Service:</strong> Recovery or reinstallation of software and data is not included unless covered by the unit's limited warranty.</li>
          <li><strong>Box and Accessories:</strong> Remove all detachable accessories unless requested. JonecoTech is not liable for missing accessories.</li>
          <li><strong>Cosmetic Damages:</strong> Cosmetic damage does not affect unit functionality and is not covered.</li>
          <li><strong>Repair Lead Time & Liability:</strong> Estimates are provided; JonecoTech is not liable for incidental or consequential losses beyond repair timelines.</li>
          <li><strong>Claim & Pickup:</strong> If not claimed within the specified period, units may be treated as abandoned and disposed of according to company policy.</li>
          <li><strong>Unsettled Payment:</strong> Units will not be released until outstanding charges are paid.</li>
          <li><strong>Lost Units:</strong> The company is not responsible for data or configurations lost; replacement parts may be from alternate sources.</li>
          <li><strong>No Parts Available:</strong> If parts are unavailable, repair may be declined; the unit may be returned unrepaired.</li>
        </ol>
      </div>

      <div class="mt-2">
        <label class="text-slate-800"><input type="checkbox" v-model="form.accepted" class="mr-2"/> I have read and accept the Service Waiver and Terms</label>
      </div>
    </div>

    <div class="flex gap-2 mt-4">
      <button v-if="step>1" @click="prevStep" class="bg-white border px-4 py-2 rounded text-slate-700">Back</button>
      <button v-if="step<4" @click="nextStep" class="bg-blue-800 text-white px-4 py-2 rounded">Next</button>
      <button v-if="step===4" @click="submit" class="bg-blue-800 text-white px-4 py-2 rounded">Submit</button>
    </div>
    <div v-if="success" class="text-green-600 mt-3">{{ success }}</div>
    <div v-if="error" class="text-red-600 mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import backend from '../mock/backend'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = reactive({
  customerName: '', contact: '', address: '', email: '',
  unitType: '', unitBrand: '', unitModel: '', serial: '', imei: '', datePurchased: '', warrantyStatus: 'In Warranty', unitUsername: '', unitPassword: '',
  request: { diagnosis:false, hardware:false, software:false, warrantyClaim:false, other:false, otherText:'' },
  accessories: { powerAdapter:false, powerCord:false, bag:false, backpack:false, sleeve:false, vga:false, hdmi:false, dp:false, others:false },
  issues: '', recommendations:'', accepted:false,
  invoiceNumber: route.query.invoice || ''
})
const step = ref(1)
const error = ref('')
const success = ref('')
const invoiceError = ref('')
const invoiceValidated = ref(false)
const showWaiver = ref(false)

function validateInvoiceNumber(){
  invoiceError.value = ''
  invoiceValidated.value = false
  const number = String(form.invoiceNumber || '').trim()
  if (!number) {
    invoiceError.value = 'Invoice number is required.'
    return false
  }
  if (!backend.validateInvoice(number)) {
    invoiceError.value = 'Invoice not found. Please enter a valid invoice number.'
    return false
  }
  form.invoiceNumber = number
  invoiceValidated.value = true
  return true
}

function nextStep(){
  if (step.value === 1 && !invoiceValidated.value && !validateInvoiceNumber()) return
  if(step.value<4) step.value++
}
function prevStep(){ if(step.value>1) step.value-- }

async function submit(){
  error.value = ''
  if (!invoiceValidated.value && !validateInvoiceNumber()) return
  if(!form.accepted){ error.value='You must accept the Service Waiver'; return }

  const invoiceNumber = String(form.invoiceNumber || '').trim()
  const validInvoice = backend.validateInvoice(invoiceNumber)
  if (!invoiceNumber || !validInvoice) {
    error.value = 'A valid invoice number is required before creating the ticket.'
    return
  }

  try{
    const payload = { ...form }
    const saved = backend.saveTicket(payload)
    success.value = 'Ticket created: ' + saved.id
    router.push({ name: 'CheckTicket', query: { q: String(saved.id) } })
  }catch(e){ error.value = e.message }
}
</script>
