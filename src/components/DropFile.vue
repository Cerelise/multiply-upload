<template>
	<div class="main">
		<div
			class="dropzone-container"
			@dragover="dragover"
			@dragleave="dragleave"
			@drop="drop"
		>
			<input
				type="file"
				multiple
				name="file"
				id="fileInput"
				class="hidden-input"
				@change="onChange"
				ref="fileInputRef"
			/>

			<label for="fileInput" class="file-label">
				<div v-if="isDragging">释放以将文件放到此处。</div>
				<div v-else>将文件拖到此处或单击此处上传。</div>
			</label>

			<div class="preview-container mt-4" v-if="files.length">
				<div v-for="file in files" :key="file.name" class="preview-card">
					<div class="flex gap-1 items-center">
						<img class="preview-img" :src="generateURL(file)" />
						<p>
							{{ file.name }}
							<!-- -
							{{ Math.round(file.size / 1000) + 'kb' }} -->
						</p>
					</div>
					<div>
						<button
							class="ml-2"
							type="button"
							@click="remove(files.indexOf(file))"
							title="Remove file"
						>
							<b>×</b>
						</button>
					</div>
				</div>
			</div>
		</div>
		<button
			class="my-5 border border-gray-400 rounded-lg px-4 py-2 hover:bg-sky-400 hover:text-white duration-200"
			@click="multipleFilesUpload"
		>
			上传
		</button>
	</div>
</template>

<script setup>
// import useAxios from '../composables/useAxios'
import axios from 'axios'
import { ref } from 'vue'

// const axios = useAxios()

const isDragging = ref(false)
const files = ref([])
const fileInputRef = ref(null)

// 文件上传
async function multipleFilesUpload() {
	const formData = new FormData()
	files.value.forEach((file) => {
		formData.append('document', file)
	})
	// console.log(formData)
	const csrfToken = await getCsrfToken()
	// console.log('csrfToken :>> ', csrfToken)
	axios
		.post('http://127.0.0.1:8000/api/multiply-upload/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-CSRFToken': csrfToken,
			},
		})
		.then((res) => console.log(res.data.message))
		.catch((error) => {
			console.log('error :>> ', error)
		})

	files.value = ''
}

function onChange() {
	files.value = [...fileInputRef.value.files]
}

function dragover(e) {
	e.preventDefault()
	isDragging.value = true
}

function dragleave() {
	isDragging.value = false
}

function drop(e) {
	e.preventDefault()
	fileInputRef.value.files = e.dataTransfer.files
	onChange()
	isDragging.value = false
}

function remove(i) {
	files.value.splice(i, 1)
}

function generateURL(file) {
	let fileSrc = URL.createObjectURL(file)
	setTimeout(() => {
		URL.revokeObjectURL(fileSrc)
	}, 1000)
	return fileSrc
}
</script>

<style lang="scss" scoped></style>
