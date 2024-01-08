// page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Select, Button, Text, Flex, rem, TextInput, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import LoginModal from '../components/LoginModal';
import { useDisclosure } from '@mantine/hooks';
import { useSession } from 'next-auth/react';

interface Courses {
  map(arg0: (course: { course_number: number; }) => number): number[];
  course_id: number;
  course_name: string;
  course_code: string;
  course_number: number;
  general_group: boolean;
}

function addAGroup() {
  const [pressedSubmit, setPressedSubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [courseNumbers, setCourseNumbers] = useState<number[]>([]);
  const [isModalOpen, { toggle: toggleModal, close: closeModal }] = useDisclosure(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      toggleModal();
    }
  }, [session]);

  const form = useForm({
    initialValues: {
      courseCode: '',
      courseNumber: '',
      section: '',
      groupLink: '',
      generalGroup: false
    },
    validate: {
      courseCode: (value) =>
        /^(CPIS|CPCS|CPIT|STAT|BUS|MRKT|ACCT)$/.test(value)
          ? null
          : "You didn't choose course code.",
      courseNumber: (value) =>
        /^(?!$)/.test(value)
          ? null
          : "You didn't choose course number.",
      section: (value, values) =>
        values.generalGroup || /^[a-zA-Z0-9]{2,3}$/.test(value)
          ? null
          : "You didn't enter the section, or entered Invalid section",
      groupLink: (value) =>
        value.startsWith("https://chat.whatsapp.com/")
          ? null
          : "You didn't enter group link, or entered Invalid group link."
    },
  });

  const handleSubmit = async (values: { courseCode: string; courseNumber: string; section: string; groupLink: string, generalGroup: boolean }) => {
    const addGroup = await fetch('/api/addGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseCode: values.courseCode,
        courseNumber: parseInt(values.courseNumber),
        section: values.generalGroup ? "NA" : values.section,
        groupLink: values.groupLink,
        generalGroup: values.generalGroup
      }),
    });

    if (addGroup.status == 400) {
      setMessage("Group for this section already exists!")
      return
    }

    setMessage("Group added succesfully!")

  };

  const fetchCourseNumbers = async (courseCode: string) => {
    const response = await fetch('/api/listOfCourses', {
      headers: {
        'courseCode': courseCode
      }
    });
    const data: Courses = await response.json() as Courses;
    const courseNumbers: number[] = data.map((course: { course_number: number; }) => course.course_number);
    setCourseNumbers(courseNumbers);
  };

  return (
    <>
      {/* Login Modal */}
      <LoginModal opened={isModalOpen} onClose={closeModal} disableClose />
      <form onSubmit={form.onSubmit(handleSubmit as (values: { courseCode: string; courseNumber: string; section: string; groupLink: string, generalGroup: boolean }) => void)} autoComplete='new-password'>
        <Flex justify="center" align="center" direction="column" mt="md">
          <Text size="h1" style={{ fontSize: rem(50), fontWeight: "bold" }} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>Add a Group</Text>
          <Text size='md' fw={500} style={{ marginBottom: rem(20) }}>Enter course details:</Text>
          <Select style={{ marginBottom: rem(20) }} withAsterisk label="Course Code:" data={['CPIS', 'CPCS', 'CPIT', 'STAT', 'BUS', 'MRKT', 'ACCT']} {...form.getInputProps('courseCode')} onChange={(value) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            form.getInputProps('courseCode').onChange(value);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            value && fetchCourseNumbers(value);
          }}
          />
          <Select style={{ marginBottom: rem(20) }} withAsterisk label="Course Number:" data={courseNumbers.map(String)} {...form.getInputProps('courseNumber')} searchable />
          <TextInput style={{ marginBottom: rem(20) }} withAsterisk label="Section: " {...form.getInputProps('section')} disabled={form.values.generalGroup} />
          <TextInput style={{ marginBottom: rem(20) }} withAsterisk label="Group Link: " {...form.getInputProps('groupLink')} />
          <Checkbox style={{ marginBottom: rem(20) }} mt="md" label="Is this a general group? (For both males and females)" {...form.getInputProps('generalGroup', { type: 'checkbox' })} />
          <Button style={{ marginBottom: rem(50) }} type="submit" onClick={() => setPressedSubmit(true)}>Submit</Button>
          <Text size="sm" style={{ marginTop: '10px', textAlign: 'center', minHeight: '1em' }}>
            {pressedSubmit ? message : ''}
          </Text>
        </Flex>
      </form>
    </>
  );
}

export default addAGroup;