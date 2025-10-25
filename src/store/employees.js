import { defineStore } from 'pinia'

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [
      { id: 1, name: 'Ali', startYear: 2010 },
      { id: 2, name: 'Vali', startYear: 2018 },
    ],
  }),
  actions: {
    addEmployee(emp) {
      this.employees.push({ id: Date.now(), ...emp })
    },
    updateEmployee(id, newData) {
      const index = this.employees.findIndex(e => e.id === id)
      if (index !== -1) this.employees[index] = { ...this.employees[index], ...newData }
    },
    removeEmployee(id) {
      this.employees = this.employees.filter(e => e.id !== id)
    }
  },
})
