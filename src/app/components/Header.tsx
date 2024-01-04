// Header.tsx

'use client';
import {
	Group,
	Button,
	Divider,
	Box,
	Burger,
	Drawer,
	ScrollArea,
	rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import classes from '~/styles/Header.module.css';
import LoginModal from './LoginModal';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
	const [isModalOpen, { toggle: toggleModal, close: closeModal }] = useDisclosure(false);

	const { data: session } = useSession();

	const handleSignInClick = () => {
		closeDrawer();
		toggleModal();
	};

	const handleSignOutClick = async () => {
		await signOut({ redirect: false });
		closeDrawer();
		// Optionally, you can redirect the user to a specific page after sign-out
	};

	return (
		<Box pb={120}>
			{/* Desktop */}
			<header className={classes.header}>
				<Group justify="space-between" h="100%">
					<p>FCIT Groups</p>
					<Group h="100%" gap={0} visibleFrom="sm">
						<Link href="/" className={classes.link}>
							Home
						</Link>
						<Link href="/findAGroup" className={classes.link}>
							Find a Group
						</Link>
						<Link href="/addAGroup" className={classes.link}>
							Add a Group
						</Link>
					</Group>

					<Group visibleFrom="sm">
						{session ? (
							<Button onClick={handleSignOutClick}>Sign Out</Button>
						) : (
							<Button onClick={handleSignInClick}>Sign In</Button>
						)}
					</Group>

					<Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
				</Group>
			</header>

			{/* Mobile */}
			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size="100%"
				padding="md"
				title="Navigation"
				hiddenFrom="sm"
				zIndex={1000000}
			>
				<ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
					<Divider my="sm" />

					<Link onClick={closeDrawer} href="/" className={classes.link}>
						Home
					</Link>
					<Link onClick={closeDrawer} href="/findAGroup" className={classes.link}>
						Find a Group
					</Link>
					<Link onClick={closeDrawer} href="/addAGroup" className={classes.link}>
						Add a Group
					</Link>

					<Divider my="sm" />

					<Group justify="center" grow pb="xl" px="md">
						{session ? (
							<Button onClick={handleSignOutClick}>Sign Out</Button>
						) : (
							<Button onClick={handleSignInClick}>Sign In</Button>
						)}
					</Group>
				</ScrollArea>
			</Drawer>

			{/* Login Modal */}
			<LoginModal opened={isModalOpen} onClose={closeModal} disableClose={false}/>
		</Box>
	);
}
