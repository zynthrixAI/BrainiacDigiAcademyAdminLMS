'use client';

import { useState } from 'react';
import type {
  CourseDetail,
  TopicDetail,
  SubtopicDetail,
  LessonSummary,
} from '@/types/course';
import { useTopicMutations } from '@/hooks/mutation/useTopicMutations';
import { useSubtopicMutations } from '@/hooks/mutation/useSubtopicMutations';
import { useLessonMutations } from '@/hooks/mutation/useLessonMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { formatDuration } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { NameModal } from './NameModal';
import { LessonFormModal } from './LessonFormModal';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { PlayIcon } from '@/components/icons/PlayIcon';

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

type TopicModal = { mode: 'create' } | { mode: 'edit'; topic: TopicDetail };
type SubtopicModal =
  | { mode: 'create'; topicId: string }
  | { mode: 'edit'; topicId: string; subtopic: SubtopicDetail };
type LessonModal = {
  topicId: string;
  subtopicId: string;
  lessonId: string | null;
  defaultOrder: number;
};

const iconBtn =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink';

export function CourseTree({ course }: { course: CourseDetail }) {
  const courseId = course.id;
  const topicMut = useTopicMutations(courseId);
  const subtopicMut = useSubtopicMutations(courseId);
  const lessonMut = useLessonMutations(courseId);
  const confirm = useConfirm();

  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set());
  const [topicModal, setTopicModal] = useState<TopicModal | null>(null);
  const [subModal, setSubModal] = useState<SubtopicModal | null>(null);
  const [lessonModal, setLessonModal] = useState<LessonModal | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const onDeleteError = (error: unknown) =>
    setActionError(apiErrorMessage(error, 'Couldn’t delete — it may require superadmin access.'));

  const deleteTopic = async (topic: TopicDetail) => {
    const ok = await confirm({
      title: `Delete topic “${topic.name}”?`,
      message: 'Its subtopics and lessons are NOT deleted automatically.',
      confirmLabel: 'Delete topic',
      tone: 'danger',
    });
    if (!ok) return;
    setActionError(null);
    topicMut.remove.mutate(topic.id, { onError: onDeleteError });
  };

  const deleteSubtopic = async (topicId: string, sub: SubtopicDetail) => {
    const ok = await confirm({
      title: `Delete subtopic “${sub.name}”?`,
      message: 'Its lessons are NOT deleted automatically.',
      confirmLabel: 'Delete subtopic',
      tone: 'danger',
    });
    if (!ok) return;
    setActionError(null);
    subtopicMut.remove.mutate({ topicId, subtopicId: sub.id }, { onError: onDeleteError });
  };

  const deleteLesson = async (topicId: string, subtopicId: string, lesson: LessonSummary) => {
    const ok = await confirm({
      title: `Delete lesson “${lesson.title}”?`,
      confirmLabel: 'Delete lesson',
      tone: 'danger',
    });
    if (!ok) return;
    setActionError(null);
    lessonMut.remove.mutate(
      { path: { courseId, topicId, subtopicId }, lessonId: lesson.id },
      { onError: onDeleteError },
    );
  };

  // Order is automatic: new items append to the end; renames leave order intact.
  const nextTopicOrder = () =>
    course.topics.reduce((max, t) => Math.max(max, t.order), -1) + 1;
  const nextSubtopicOrder = (topicId: string) => {
    const topic = course.topics.find((t) => t.id === topicId);
    return (topic?.subtopics ?? []).reduce((max, s) => Math.max(max, s.order), -1) + 1;
  };

  const submitTopic = (name: string) => {
    if (!topicModal) return;
    const opts = { onSuccess: () => setTopicModal(null) };
    if (topicModal.mode === 'edit') {
      topicMut.update.mutate({ topicId: topicModal.topic.id, body: { name } }, opts);
    } else {
      topicMut.create.mutate({ name, order: nextTopicOrder() }, opts);
    }
  };

  const submitSubtopic = (name: string) => {
    if (!subModal) return;
    const opts = { onSuccess: () => setSubModal(null) };
    if (subModal.mode === 'edit') {
      subtopicMut.update.mutate(
        { topicId: subModal.topicId, subtopicId: subModal.subtopic.id, body: { name } },
        opts,
      );
    } else {
      subtopicMut.create.mutate(
        { topicId: subModal.topicId, body: { name, order: nextSubtopicOrder(subModal.topicId) } },
        opts,
      );
    }
  };

  const topics = [...course.topics].sort(byOrder);

  return (
    <Card className="!p-0">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex flex-col">
          <h2 className="font-display text-[15px] font-extrabold text-ink">Course content</h2>
          <span className="text-[12.5px] text-muted">
            {topics.length} {topics.length === 1 ? 'topic' : 'topics'} ·{' '}
            {course.total_lessons} lessons
          </span>
        </div>
        <Button onClick={() => setTopicModal({ mode: 'create' })}>
          <PlusIcon size={14} /> Add topic
        </Button>
      </div>

      {actionError && (
        <p className="border-b border-line px-5 py-2.5 text-[13px] font-medium text-[var(--red)]">
          {actionError}
        </p>
      )}

      {topics.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted">
          No topics yet. Add the first topic to start building this course.
        </p>
      ) : (
        <ul>
          {topics.map((topic) => {
            const open = openTopics.has(topic.id);
            const subs = [...topic.subtopics].sort(byOrder);
            return (
              <li key={topic.id} className="border-b border-line last:border-b-0">
                <div className="flex items-center gap-2 px-3 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={() => toggle(openTopics, topic.id, setOpenTopics)}
                    className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                  >
                    <ChevronRightIcon
                      size={15}
                      className={`shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`}
                    />
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink text-[11px] font-bold text-white">
                      {topic.order}
                    </span>
                    <span className="truncate font-display text-[14px] font-bold text-ink">
                      {topic.name}
                    </span>
                    <span className="shrink-0 text-[12px] text-muted">
                      {subs.length} {subs.length === 1 ? 'subtopic' : 'subtopics'}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title="Add subtopic"
                      onClick={() => setSubModal({ mode: 'create', topicId: topic.id })}
                      className={iconBtn}
                    >
                      <PlusIcon size={14} />
                    </button>
                    <button
                      type="button"
                      title="Edit topic"
                      onClick={() => setTopicModal({ mode: 'edit', topic })}
                      className={iconBtn}
                    >
                      <EditIcon size={13} />
                    </button>
                    <button
                      type="button"
                      title="Delete topic"
                      onClick={() => deleteTopic(topic)}
                      className={`${iconBtn} hover:!border-[var(--red)] hover:!text-[var(--red)]`}
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="bg-[#faf9f7]">
                    {subs.length === 0 ? (
                      <p className="px-5 py-4 pl-12 text-[13px] text-muted">No subtopics yet.</p>
                    ) : (
                      <ul>
                        {subs.map((sub) => {
                          const subOpen = openSubs.has(sub.id);
                          const lessons = [...sub.lessons].sort(byOrder);
                          return (
                            <li key={sub.id} className="border-t border-line">
                              <div className="flex items-center gap-2 py-2.5 pl-10 pr-3 sm:pr-5">
                                <button
                                  type="button"
                                  onClick={() => toggle(openSubs, sub.id, setOpenSubs)}
                                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                                >
                                  <ChevronRightIcon
                                    size={14}
                                    className={`shrink-0 text-muted transition-transform ${subOpen ? 'rotate-90' : ''}`}
                                  />
                                  <span className="truncate text-[13.5px] font-semibold text-ink">
                                    {sub.name}
                                  </span>
                                  <span className="shrink-0 text-[12px] text-muted">
                                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                                  </span>
                                </button>
                                <div className="flex shrink-0 items-center gap-1">
                                  <button
                                    type="button"
                                    title="Add lesson"
                                    onClick={() =>
                                      setLessonModal({
                                        topicId: topic.id,
                                        subtopicId: sub.id,
                                        lessonId: null,
                                        defaultOrder: lessons.length,
                                      })
                                    }
                                    className={iconBtn}
                                  >
                                    <PlusIcon size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    title="Edit subtopic"
                                    onClick={() =>
                                      setSubModal({ mode: 'edit', topicId: topic.id, subtopic: sub })
                                    }
                                    className={iconBtn}
                                  >
                                    <EditIcon size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    title="Delete subtopic"
                                    onClick={() => deleteSubtopic(topic.id, sub)}
                                    className={`${iconBtn} hover:!border-[var(--red)] hover:!text-[var(--red)]`}
                                  >
                                    <TrashIcon size={13} />
                                  </button>
                                </div>
                              </div>

                              {subOpen && (
                                <div className="pb-2">
                                  {lessons.length === 0 ? (
                                    <p className="py-3 pl-16 text-[13px] text-muted">
                                      No lessons yet.
                                    </p>
                                  ) : (
                                    <ul>
                                      {lessons.map((lesson) => (
                                        <li
                                          key={lesson.id}
                                          className="flex items-center gap-2 py-2 pl-16 pr-3 sm:pr-5 hover:bg-white"
                                        >
                                          <span className="text-muted-2">
                                            <PlayIcon size={13} />
                                          </span>
                                          <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                                            {lesson.title}
                                          </span>
                                          {lesson.is_free_preview && (
                                            <Pill className="bg-yellow-soft text-yellow-ink">
                                              Free
                                            </Pill>
                                          )}
                                          <span className="shrink-0 font-mono text-[12px] text-muted">
                                            {formatDuration(lesson.duration_seconds)}
                                          </span>
                                          <button
                                            type="button"
                                            title="Edit lesson"
                                            onClick={() =>
                                              setLessonModal({
                                                topicId: topic.id,
                                                subtopicId: sub.id,
                                                lessonId: lesson.id,
                                                defaultOrder: lesson.order,
                                              })
                                            }
                                            className={iconBtn}
                                          >
                                            <EditIcon size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            title="Delete lesson"
                                            onClick={() => deleteLesson(topic.id, sub.id, lesson)}
                                            className={`${iconBtn} hover:!border-[var(--red)] hover:!text-[var(--red)]`}
                                          >
                                            <TrashIcon size={13} />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {topicModal && (
        <NameModal
          open
          title={topicModal.mode === 'edit' ? 'Edit topic' : 'Add topic'}
          nameLabel="Topic name"
          initialName={topicModal.mode === 'edit' ? topicModal.topic.name : ''}
          pending={topicMut.create.isPending || topicMut.update.isPending}
          error={
            topicMut.create.error || topicMut.update.error
              ? apiErrorMessage(
                  topicMut.create.error ?? topicMut.update.error,
                  'Couldn’t save the topic.',
                )
              : null
          }
          onSubmit={submitTopic}
          onClose={() => setTopicModal(null)}
        />
      )}

      {subModal && (
        <NameModal
          open
          title={subModal.mode === 'edit' ? 'Edit subtopic' : 'Add subtopic'}
          nameLabel="Subtopic name"
          initialName={subModal.mode === 'edit' ? subModal.subtopic.name : ''}
          pending={subtopicMut.create.isPending || subtopicMut.update.isPending}
          error={
            subtopicMut.create.error || subtopicMut.update.error
              ? apiErrorMessage(
                  subtopicMut.create.error ?? subtopicMut.update.error,
                  'Couldn’t save the subtopic.',
                )
              : null
          }
          onSubmit={submitSubtopic}
          onClose={() => setSubModal(null)}
        />
      )}

      {lessonModal && (
        <LessonFormModal
          open
          path={{ courseId, topicId: lessonModal.topicId, subtopicId: lessonModal.subtopicId }}
          lessonId={lessonModal.lessonId}
          defaultOrder={lessonModal.defaultOrder}
          onClose={() => setLessonModal(null)}
        />
      )}
    </Card>
  );
}
