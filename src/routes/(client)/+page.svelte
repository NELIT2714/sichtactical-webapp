<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	import Header from "$lib/components/+header.svelte";
	import UserProfile from "$lib/components/screens/+user-profile.svelte";
	import NearestEvent from "$lib/components/screens/+nearest-event.svelte";
	import NewsFeed from "$lib/components/screens/+news-feed.svelte";
	import Referral from "$lib/components/screens/+referral.svelte";

	import SkeletonUserProfile from "$lib/components/skeletons/+user-profile.svelte";
	import SkeletonNearestEvent from "$lib/components/skeletons/+nearest-event.svelte";
	import SkeletonNewsFeed from "$lib/components/skeletons/+news-feed.svelte";

	export let data;

	// $: user = data.user;
	// $: eventInfo = data.event;

	// $: registeredEvent = events && events.length > 1 ? events[1] : null;
	// $: nearestEvent = events && events.length > 0 ? events[0] : null;
</script>

<Header>
	<h1 class="text-xl font-bold uppercase">Sich Tactical</h1>
</Header>

<main class="md:container md:mx-auto py-4 flex flex-col gap-7">
	{#await data.appData}
		<SkeletonUserProfile />
		<SkeletonNearestEvent />
		<SkeletonNewsFeed />
	{:then appData}
		<div class="contents" use:fadeUp={{ delayStep: 300 }} >
			<UserProfile user={appData.user} />

			{#if appData.event}
				<NearestEvent eventInfo={appData.event} />
			{/if}

			<NewsFeed />
			<Referral user={appData.user} />
		</div>
	{/await}
</main>
