<script lang="ts">
	import { fadeUp } from "$lib/context/js/ui/fadeUp";

	import Header from "$lib/components/+header.svelte";
	import UserProfile from "$lib/components/screens/+user-profile.svelte";
	import QuickActions from "$lib/components/screens/+quick-actions.svelte";
	import NearestEvent from "$lib/components/screens/+nearest-event.svelte";
	import NoEvents from "$lib/components/screens/+no-events.svelte";
	import TopPlayers from "$lib/components/screens/+top-players.svelte";
	import NewsFeed from "$lib/components/screens/+news-feed.svelte";
	import ClubStats from "$lib/components/screens/+club-stats.svelte";
	import Referral from "$lib/components/screens/+referral.svelte";
	import WeekPreview from "$lib/components/screens/+week-preview.svelte";

	export let data;

	$: user = data.user;
	$: eventInfo = data.event;

	// $: registeredEvent = events && events.length > 1 ? events[1] : null;
	// $: nearestEvent = events && events.length > 0 ? events[0] : null;
</script>

<Header>
	<h1 class="text-xl font-bold uppercase">Sich Tactical</h1>
</Header>

<main use:fadeUp={{ delayStep: 300 }} class="md:container md:mx-auto py-4 flex flex-col gap-7">
	<UserProfile {user} />

<!--	<QuickActions />-->
<!--	<WeekPreview />-->

	<!--{#if registeredEvent}-->
<!--		<RegisteredEvent />-->
	<!--{/if}-->

	{#if eventInfo}
		<NearestEvent eventInfo={eventInfo} />
	{/if}

	<NewsFeed />

	<Referral {user} />

<!--	<TopPlayers />-->
<!--	<ClubStats />-->
</main>
