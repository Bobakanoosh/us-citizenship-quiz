export function* _shuffle(arr: any[]) {
	arr = [...arr];
	while (arr.length) yield arr.splice((Math.random() * arr.length) | 0, 1)[0];
}

export function shuffle(arr: any[]) {
	return [..._shuffle(arr)];
}
