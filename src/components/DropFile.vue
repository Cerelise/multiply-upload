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
				accept=".pdf,.jpg,.jpeg,.png"
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
							{{ file.name }} -
							{{ Math.round(file.size / 1000) + 'kb' }}
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
	</div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const isDragging = ref(false)
const files = ref([])
const fileInputRef = ref(null)

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

// 单文件上传
function fileUpload() {
	const formData = new FormData()
	console.log(files.value)
	files.value.forEach((file) => {
		formData.append('file', file)
	})
	console.log('formData :>> ', formData)
	axios
		.post('/api/train/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => console.log(res.data.message))
		.catch((error) => {
			console.log('error :>> ', error)
		})
}

// 多文件上传
function multipleFilesUpload() {
	const formData = new FormData()
	files.value.forEach((file) => {
		formData.append('files', file)
	})

	axios
		.post('/api/file/multiple_upload/', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => console.log(res.data))
		.catch((error) => {
			console.log('error :>> ', error)
		})

	files.value = ''
}
</script>

<style lang="scss" scoped></style>
