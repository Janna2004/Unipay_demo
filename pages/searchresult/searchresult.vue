<template>
	<view>
		id is {{id}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0
			}
		},
		onLoad(e) {
			this.id = e.id
		},
		methods: {

		}
	}
</script>

<style>

</style>