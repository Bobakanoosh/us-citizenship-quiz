<script setup lang="ts">
import q from "@/assets/questions.json";
import IconGithub from "@/components/IconGithub.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { useLocalStorage } from "@vueuse/core";
import { ref, computed, nextTick, watch, watchEffect } from "vue";
import { shuffle } from "./util/shuffle";

const questions: Type.Question[] = q;

const isQuizzing = ref(false);
const unaskedQuestions = ref<number[]>([]);
const currentQuestionNumber = ref<number>();
const completed = ref(false);

const excludeCurrentQuestions = useLocalStorage("excludeCurrentQuestions", false);
const onlyCurrentQuestions = useLocalStorage("onlyCurrentQuestions", false);
const min = useLocalStorage("min", 0);
const max = useLocalStorage("max", questions.length);
const currentQuestion = computed(() => (currentQuestionNumber.value !== undefined ? questions[currentQuestionNumber.value] : undefined));

function startQuiz() {
	let questionsToAsk = questions.map((q, $i) => $i).slice(min.value, max.value);
	if (excludeCurrentQuestions.value) {
		questionsToAsk = questionsToAsk.filter((q) => !questions[q].current);
	} else if (onlyCurrentQuestions.value) {
		questionsToAsk = questionsToAsk.filter((q) => questions[q].current);
	}

	unaskedQuestions.value = shuffle(questionsToAsk);
	getNewQuestion();
}

function getNewQuestion() {
	if (unaskedQuestions.value.length === 0) {
		isQuizzing.value = false;
		completed.value = true;
		setTimeout(() => (completed.value = false), 6 * 1000);
		return;
	}

	currentQuestionNumber.value = undefined;
	nextTick(() => {
		currentQuestionNumber.value = unaskedQuestions.value.pop();
	});
}
</script>

<template>
	<div class="flex justify-center h-full w-full overflow-y-auto p-5">
		<div class="flex flex-col gap-y-6 h-full text-white max-w-2xl lg:gap-y-8">
			<div class="flex flex-col gap-y-2">
				<div class="flex items-center justify-between text-2xl">
					<h1 class="font-bold">US Citizenship Quiz</h1>
					<a href="https://github.com/Bobakanoosh/us-citizenship-quiz" target="_blank">
						<IconGithub />
					</a>
				</div>
				<p class="text-gray-400">
					Basic citizenship quiz tool to help you ace the test. There are 100 questions total. Add 10 new questions each day by increasing
					the range of the questions
				</p>
			</div>
			<div class="flex items-center gap-x-5 gap-y-4 flex-wrap md:justify-between">
				<div class="flex flex-col gap-y-1.5">
					<p>From question</p>
					<input v-model="min" type="number" placeholder="0" class="w-32" />
				</div>
				<div class="flex flex-col gap-y-1.5">
					<p>To question</p>
					<input v-model="max" type="number" placeholder="100" class="w-32" />
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="flex gap-x-2">
						<input v-model="excludeCurrentQuestions" type="checkbox" />
						<p>Exclude current questions</p>
					</div>
					<div class="flex gap-x-2">
						<input v-model="onlyCurrentQuestions" type="checkbox" />
						<p>Only current questions</p>
					</div>
				</div>
			</div>
			<hr class="border-gray-600" />
			<div class="flex flex-col gap-y-4">
				<div class="flex justify-between">
					<button
						class="w-24"
						:class="{
							'bg-red-500 hover:bg-red-600': isQuizzing,
							'bg-blue-500 hover:bg-blue-600': !isQuizzing,
						}"
						@click="
							() => {
								if (isQuizzing) {
									isQuizzing = false;
									return;
								}

								isQuizzing = true;
								startQuiz();
							}
						"
					>
						{{ isQuizzing ? "Stop Quiz" : "Start Quiz" }}
					</button>
					<button v-if="isQuizzing" class="w-32 bg-gray-600" @click="getNewQuestion()">Next Question</button>
				</div>
				<span v-if="completed" class="text-green-500 text-xl">You finished!!</span>
				<template v-if="isQuizzing">
					<QuestionCard v-if="currentQuestion" :question="currentQuestion" />
				</template>
			</div>
		</div>
	</div>
</template>

<style scoped>
input {
	@apply bg-transparent border border-gray-600 rounded-md px-3 py-1.5 bg-gray-800;
}

button {
	@apply px-3 py-2 rounded-md;
}
</style>
