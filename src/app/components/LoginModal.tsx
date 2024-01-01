import React, { useState } from 'react';
import { Modal, TextInput, Button, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from "next-auth/react";


function LoginModal({ opened, onClose }: { opened: boolean; onClose: () => void; }) {
	const [pressedSignIn, setPressedSignIn] = useState(false);
	const form = useForm({
		initialValues: {
			email: '',
		},
		validate: {
			email: (value) =>
				/^[^\s@]+@stu\.kau\.edu\.sa$/.test(value)
					? null
					: 'Invalid email, please enter a valid KAU email address.',
		},
	});


	const handleSignIn = async (email: string) => {
		signIn("email", { email, redirect: false }).then(() => {
			setPressedSignIn(true)
		});
	}

	return (
		<Modal opened={opened} onClose={onClose} title="Log in" centered overlayProps={{ backgroundOpacity: 0.55, blur: 3, }}
		trapFocus={true} closeOnEscape={!pressedSignIn} closeOnClickOutside={!pressedSignIn} withCloseButton={!pressedSignIn}
		>
			<form onSubmit={form.onSubmit((values) => handleSignIn(values.email))}>
				<Text size="md" style={{ marginBottom: '20px' }}>
					In order to use this website, you must sign in with your university email.
				</Text>
				<TextInput withAsterisk label="Email" {...form.getInputProps('email')} />

				<Group justify="center" mt="md">
					<Button type="submit" disabled={pressedSignIn}>Submit</Button>
				</Group>

				{pressedSignIn && (
					<Text size="sm" style={{ marginTop: '10px', textAlign: 'center' }}>
						Please check your email to sign in. If you don&apos;t see the email, please check your spam folder.
					</Text>
				)}
			</form>
		</Modal>
	);
}

export default LoginModal;