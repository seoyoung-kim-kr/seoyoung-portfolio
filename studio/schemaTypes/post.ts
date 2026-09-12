import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Project & Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project / Post Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL Path)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'company',
      title: 'Company / Organization / Project Scope',
      type: 'string',
      description: '예: (주)썬더소프트코리아, 개인 프로젝트, 팀 프로젝트',
    }),
    defineField({
      name: 'path',
      title: 'Legacy Path (Optional)',
      type: 'string',
      description: 'Used for backward compatibility if slug is not defined',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (Optional for ongoing)',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category / Domain',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'Story & Career', value: 'my-story' },
          { title: 'Retrospective', value: 'retrospective' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'skills',
      title: 'Tech Stack (Skills)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub Repository URL',
      type: 'url',
    }),
    defineField({
      name: 'role',
      title: 'Role & Contribution',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content',
      title: 'Markdown Content / Case Study',
      type: 'text',
      rows: 15,
    }),
  ],
})
