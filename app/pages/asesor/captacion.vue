<script setup lang="ts">
import { ref } from 'vue'
import type { 
  LeadVendedor, 
  CitaExpandida, 
  ClienteConContrato,
  TipoPersona,
  EstadoVendedor,
  EstadoVisitaGuiada
} from '~~/shared/types'

definePageMeta({
  layout: 'asesor',
})

// Tab actual
type TabType = 'Leads' | 'Citas' | 'Clientes'
const currentTab = ref<TabType>('Leads')
const setTab = (tab: TabType) => (currentTab.value = tab)

// Modal nuevo lead
const showNuevoLeadForm = ref(false)

// Datos reactivos tipados según el schema SQL
const leads = ref<LeadVendedor[]>([
  {
    id_persona: 1,
    nombre: 'Lead Ejemplo',
    celular: '900000000',
    tipo: 'Lead Propio',
    fecha_captacion: '2025-01-01',
    estado_vendedor: 'Seguimiento',
    observacion: null,
    id_usuario: 2
  }
])

const citas = ref<CitaExpandida[]>([])
const clientes = ref<ClienteConContrato[]>([])

// Crear nuevo lead
const handleCrearLead = (nuevoLead: { nombre: string; celular: string; fecha: string; tipo: TipoPersona }) => {
  const newId = Math.max(...leads.value.map(l => l.id_persona), 0) + 1
  leads.value.push({
    id_persona: newId,
    nombre: nuevoLead.nombre,
    celular: nuevoLead.celular,
    tipo: nuevoLead.tipo,
    fecha_captacion: nuevoLead.fecha,
    estado_vendedor: 'Seguimiento',
    observacion: null,
    id_usuario: 2 // TODO: obtener del usuario logueado
  })
}

// Guardar lead (pasarlo a citas)
const handleGuardarLead = (lead: LeadVendedor) => {
  const newCita: CitaExpandida = {
    id_cita: Date.now(),
    fecha_agendada: new Date().toISOString(),
    observacion: lead.observacion,
    estado_visita_guiada: 'Realizó visita',
    id_persona: lead.id_persona,
    id_usuario: lead.id_usuario,
    persona: {
      id_persona: lead.id_persona,
      nombre: lead.nombre,
      celular: lead.celular,
      tipo: lead.tipo,
      fecha_captacion: lead.fecha_captacion
    },
    usuario: {
      id_usuario: lead.id_usuario,
      nombre_usuario: 'asesor',
      contrasena: '',
      correo: '',
      nombres: null,
      apellidos: null,
      supervisor_id: null,
      id_rol: 2
    }
  }
  citas.value.push(newCita)
  leads.value = leads.value.filter(l => l.id_persona !== lead.id_persona)
}

// Guardar cita (pasarla a clientes)
const handleGuardarCita = (cita: CitaExpandida) => {
  const newCliente: ClienteConContrato = {
    id_persona: cita.id_persona,
    nombre: cita.persona.nombre,
    celular: cita.persona.celular,
    tipo: 'Cliente',
    fecha_captacion: cita.persona.fecha_captacion
  }
  clientes.value.push(newCliente)
  citas.value = citas.value.filter(c => c.id_cita !== cita.id_cita)
}

// Eliminar items
const handleEliminarLead = (id: number) => {
  leads.value = leads.value.filter(l => l.id_persona !== id)
}

const handleEliminarCita = (id: number) => {
  citas.value = citas.value.filter(c => c.id_cita !== id)
}

const handleEliminarCliente = (id: number) => {
  clientes.value = clientes.value.filter(c => c.id_persona !== id)
}

// Actualizar estados
const handleUpdateEstadoLead = (id: number, estado: EstadoVendedor) => {
  const lead = leads.value.find(l => l.id_persona === id)
  if (lead) lead.estado_vendedor = estado
}

const handleUpdateEstadoCita = (id: number, estado: EstadoVisitaGuiada) => {
  const cita = citas.value.find(c => c.id_cita === id)
  if (cita) cita.estado_visita_guiada = estado
}

const handleUpdateVendido = (id: number, vendido: boolean) => {
  // TODO: implementar lógica de vendido
  console.log('Update vendido:', id, vendido)
}
</script>
<!-------------------------------------------------------------PARTE VISUAL EN PANTALLA ---------------------------------------------------------------->
<template>
  <div class="p-8">
    <!-- Encabezado (Tabs + Botón agregar) -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex space-x-2">
        <button
          v-for="tab in (['Leads', 'Citas', 'Clientes'] as const)"
          :key="tab"
          @click="setTab(tab)"
          class="px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-md border border-gray-200"
          :class="{
            'bg-negro-primario text-blanco-primario': currentTab === tab,
            'bg-blanco-primario text-negro-primario hover:bg-gray-50': currentTab !== tab,
          }"
        >
          {{ tab }}
        </button>
      </div>

      <button
        @click="showNuevoLeadForm = true"
        class="px-4 py-2 rounded-full font-semibold shadow-md bg-blanco-primario text-negro-primario border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        + Agregar Lead
      </button>
    </div>

    <!-- Tabla de Leads -->
    <CaptacionTablesTablaLeads
      v-if="currentTab === 'Leads'"
      :leads="leads"
      @guardar="handleGuardarLead"
      @eliminar="handleEliminarLead"
      @update-estado="handleUpdateEstadoLead"
    />

    <!-- Tabla de Citas -->
    <CaptacionTablesTablaCitas
      v-if="currentTab === 'Citas'"
      :citas="citas"
      @guardar="handleGuardarCita"
      @eliminar="handleEliminarCita"
      @update-estado="handleUpdateEstadoCita"
    />

    <!-- Tabla de Clientes -->
    <CaptacionTablesTablaClientes
      v-if="currentTab === 'Clientes'"
      :clientes="clientes"
      @eliminar="handleEliminarCliente"
      @update-vendido="handleUpdateVendido"
    />

    <!-- Modal Nuevo Lead -->
    <CaptacionFormsNuevoLeadForm
      v-if="showNuevoLeadForm"
      @close="showNuevoLeadForm = false"
      @crear="handleCrearLead"
    />
  </div>
</template>
