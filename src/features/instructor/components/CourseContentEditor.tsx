import { useState } from 'react';
import { useEditCourse } from '../hooks/useEditCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface CourseContentEditorProps {
  courseId: string;
}

export function CourseContentEditor({ courseId }: CourseContentEditorProps) {
  const {
    course,
    isLoading,
    error,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
  } = useEditCourse(courseId);

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading course content: {error}
      </div>
    );
  }

  if (!course) {
    return <div className="p-4">No course found</div>;
  }

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await addSection(newSectionTitle);
      setNewSectionTitle('');
      toast.success('Section added successfully');
    } catch (err) {
      toast.error('Failed to add section');
    }
  };

  const handleAddLesson = async (sectionId: string) => {
    try {
      await addLesson(sectionId, {
        title: 'New Lesson',
        type: 'VIDEO',
        content: '',
        duration: 0,
      });
      toast.success('Lesson added successfully');
    } catch (err) {
      toast.error('Failed to add lesson');
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'section') {
      const sections = Array.from(course.sections);
      const [removed] = sections.splice(source.index, 1);
      sections.splice(destination.index, 0, removed);

      // Update order for all affected sections
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].order !== i) {
          await updateSection(sections[i].id, { order: i });
        }
      }
    } else if (type === 'lesson') {
      const sourceSection = course.sections.find(
        (s) => s.id === source.droppableId
      );
      const destSection = course.sections.find(
        (s) => s.id === destination.droppableId
      );

      if (!sourceSection || !destSection) return;

      const sourceLessons = Array.from(sourceSection.lessons);
      const destLessons =
        source.droppableId === destination.droppableId
          ? sourceLessons
          : Array.from(destSection.lessons);

      const [removed] = sourceLessons.splice(source.index, 1);
      destLessons.splice(destination.index, 0, removed);

      // Update order for all affected lessons
      if (source.droppableId === destination.droppableId) {
        for (let i = 0; i < destLessons.length; i++) {
          if (destLessons[i].order !== i) {
            await updateLesson(destSection.id, destLessons[i].id, { order: i });
          }
        }
      } else {
        // Handle moving between sections
        for (let i = 0; i < sourceLessons.length; i++) {
          await updateLesson(sourceSection.id, sourceLessons[i].id, { order: i });
        }
        for (let i = 0; i < destLessons.length; i++) {
          await updateLesson(destSection.id, destLessons[i].id, { order: i });
        }
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleAddSection} className="flex gap-4">
        <Input
          placeholder="Enter section title"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" disabled={!newSectionTitle.trim()}>
          Add Section
        </Button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {course.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative"
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-50 hover:opacity-100"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 pl-8">
                              <Input
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="text-lg font-semibold"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSection(section.id)}
                              >
                                {expandedSections.includes(section.id)
                                  ? 'Collapse'
                                  : 'Expand'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSection(section.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        {expandedSections.includes(section.id) && (
                          <CardContent>
                            <Droppable
                              droppableId={section.id}
                              type="lesson"
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="space-y-4"
                                >
                                  {section.lessons
                                    .sort((a, b) => a.order - b.order)
                                    .map((lesson, index) => (
                                      <Draggable
                                        key={lesson.id}
                                        draggableId={lesson.id}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="relative"
                                          >
                                            <div
                                              {...provided.dragHandleProps}
                                              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-50 hover:opacity-100"
                                            >
                                              <GripVertical className="h-5 w-5" />
                                            </div>
                                            <CardContent className="flex flex-col gap-4 p-4 pl-8">
                                              <div className="flex items-center justify-between gap-4">
                                                <Input
                                                  value={lesson.title}
                                                  onChange={(e) =>
                                                    updateLesson(
                                                      section.id,
                                                      lesson.id,
                                                      {
                                                        title: e.target.value,
                                                      }
                                                    )
                                                  }
                                                  className="flex-1"
                                                />
                                                <Select
                                                  value={lesson.type}
                                                  onValueChange={(value) =>
                                                    updateLesson(
                                                      section.id,
                                                      lesson.id,
                                                      {
                                                        type: value as
                                                          | 'VIDEO'
                                                          | 'QUIZ'
                                                          | 'ASSIGNMENT',
                                                      }
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="w-[180px]">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="VIDEO">
                                                      Video
                                                    </SelectItem>
                                                    <SelectItem value="QUIZ">
                                                      Quiz
                                                    </SelectItem>
                                                    <SelectItem value="ASSIGNMENT">
                                                      Assignment
                                                    </SelectItem>
                                                  </SelectContent>
                                                </Select>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  onClick={() =>
                                                    deleteLesson(
                                                      section.id,
                                                      lesson.id
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                              <Textarea
                                                value={lesson.content}
                                                onChange={(e) =>
                                                  updateLesson(
                                                    section.id,
                                                    lesson.id,
                                                    {
                                                      content: e.target.value,
                                                    }
                                                  )
                                                }
                                                placeholder="Lesson content..."
                                                className="min-h-[100px]"
                                              />
                                            </CardContent>
                                          </Card>
                                        )}
                                      </Draggable>
                                    ))}
                                  {provided.placeholder}
                                  <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => handleAddLesson(section.id)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Lesson
                                  </Button>
                                </div>
                              )}
                            </Droppable>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 