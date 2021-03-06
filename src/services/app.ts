import Groups from '@/db/models/Groups'
import Qas, { IQas } from '@/db/models/Qas'
import { Service_addGroup } from './index'

export interface IGetAnalysisData {
	name: string
	total: number
	average_rate: number
}

export interface IExportData {
	name: string
	data: Array<IQas>
}

export const Service_addTableGroups = async (): Promise<boolean> => {
	const groups = new Groups()

	try {
		await groups.init()
	} catch (_) {
		return false
	}

	return true
}

export const Service_getAllGroups = async (): Promise<Array<string>> => {
	const groups = new Groups()

	return await groups.getGroups()
}

export const Service_deleteGroup = async (group: string): Promise<boolean> => {
	const groups = new Groups()

	try {
		await groups.delGroup(group)
	} catch (_) {
		return false
	}

	return true
}

export const Service_getAnalysisData = async (): Promise<Array<IGetAnalysisData>> => {
	const groups = new Groups()
	const groups_array = await groups.getGroups()
	const analysis_data = []

	for (let i of groups_array) {
		const qa = new Qas(i)
		const total = await qa.getTotal()
		const average_rate = await qa.getAverageRate()

		analysis_data.push({
			name: i,
			total: total,
			average_rate: average_rate
		})
	}

	return analysis_data
}

export const Service_importData = async (data: Array<IExportData>): Promise<boolean | string> => {
	for (let i of data) {
		await Service_addGroup(i.name)

		const qa = new Qas(i.name)

		const res = await qa.bulkAddQa(i.data)

		if (res !== true) return res
	}

	return true
}

export const Service_exportData = async (): Promise<Array<IExportData>> => {
	const groups = new Groups()
	const groups_array = await groups.getGroups()
	const export_data = []

	for (let i of groups_array) {
		const qa = new Qas(i)
		const total_qas = await qa.getTotalQas()

		export_data.push({
			name: i,
			data: total_qas
		})
	}

	return export_data
}
