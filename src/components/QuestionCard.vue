<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue";

const props = defineProps<{ question: Type.Question }>();
const showAnswer = ref(false);
</script>

<template>
	<div class="flex flex-col gap-y-4 bg-green-700 p-3 rounded-lg text-lg" @click="showAnswer = !showAnswer">
		<span class="font-medium">{{ question.question }}</span>
		<div v-if="showAnswer" class="flex flex-col gap-y-0.5">
			<span v-for="(answer, index) of question.answers" :key="index">{{ `${index + 1}. ${answer}` }}</span>
		</div>
	</div>
</template>
