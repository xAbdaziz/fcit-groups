// GenderModal.tsx
'use client'
import { Button, Group, Modal, Select, Text } from '@mantine/core';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function GenderModal() {
	const { data: session } = useSession();
	const [value, setValue] = useState<string | null>('');
	const [errorMessage, setErrorMessage] = useState<string | null>('');
	const [isModalOpen, setIsModalOpen] = useState(true);

	const textStyles = {
		marginBottom: 10,
	};

	const handleGenderSubmit = async () => {
		if (value === '') {
			setErrorMessage('You didn\'t select your gender');
			return;
		}

		const genderValue = value === 'Male' ? 1 : 2;

		const response = await fetch('/api/updateGender', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: session?.user.email,
				gender: genderValue,
			}),
		});

		if (!response.ok) {
			setErrorMessage('Gender update failed');
			return;
		}

		// Handle successful update
		setErrorMessage(''); // Clear the error message
		setIsModalOpen(false); // Close the modal
	};

	return (
		<Modal opened={isModalOpen} onClose={() => { return }} title="Before we start, let us get to know you better."
			centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
			trapFocus={true} closeOnEscape={false} closeOnClickOutside={false} withCloseButton={false}>
			<Group justify="center" mt="md">
				<Text style={textStyles}>Please enter your gender, this will help us to provide links for your section.</Text>
				<Text style={{ ...textStyles, color: 'red' }}>Keep in mind that you won&apos;t be able to change this later on.</Text>
			</Group>
			<Select
				style={{ marginBottom: 15 }}
				label="What's your Gender?"
				placeholder="Pick value"
				data={['Male', 'Female']}
				value={value}
				onChange={setValue}
			/>
			<Text style={{ ...textStyles, color: 'red' }}>{errorMessage}</Text>
			<Group justify="center" mt="md">
				<Button onClick={handleGenderSubmit}>Submit</Button>
			</Group>
		</Modal>
	);
}