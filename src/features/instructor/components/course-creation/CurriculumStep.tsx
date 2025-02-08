import { useState, useEffect } from 'react';
import { Plus, X, GripVertical, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { VideoUpload } from '@/components/lesson/VideoUpload';
import { VideoPlayer } from '@/components/lesson/VideoPlayer';

interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'READING' | 'QUIZ' | 'ASSIGNMENT';
  content?: string;
  duration?: number;
  order: number;
  videoUrl?: string;
  videoProvider?: 'LOCAL' | 'YOUTUBE';
  videoThumbnail?: string;
}

interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  isExpanded?: boolean;
}

interface CurriculumStepProps {
  initialData?: {
    sections: Section[];
  };
  onSave: (data: { sections: Section[] }) => void;
}

export function CurriculumStep({ initialData, onSave }: CurriculumStepProps) {
  const [sections, setSections] = useState<Section[]>(
    initialData?.sections.map(section => ({
      ...section,
      isExpanded: true
    })) || []
  );

  useEffect(() => {
    if (initialData?.sections) {
      setSections(initialData.sections.map(section => ({
        ...section,
        isExpanded: true
      })));
    }
  }, [initialData]);

  const generateId = () => crypto.randomUUID();

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      title: `Section ${sections.length + 1}`,
      description: '',
      lessons: [],
      order: sections.length,
      isExpanded: true
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
    ));
  };

  const addLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newLesson: Lesson = {
      id: generateId(),
      title: `Lesson ${section.lessons.length + 1}`,
      type: 'VIDEO',
      order: section.lessons.length,
    };

    updateSection(sectionId, {
      lessons: [...section.lessons, newLesson]
    });
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
    });
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      lessons: section.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      )
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'section') {
      const reorderedSections = Array.from(sections);
      const [removed] = reorderedSections.splice(source.index, 1);
      reorderedSections.splice(destination.index, 0, removed);

      // Update order property
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index
      }));

      setSections(updatedSections);
      return;
    }

    // Handle lesson reordering
    const [sectionId] = source.droppableId.split('-');
    const sourceSectionId = sectionId;
    const destinationSectionId = destination.droppableId.split('-')[0];

    const sourceSection = sections.find(s => s.id === sourceSectionId);
    const destSection = sections.find(s => s.id === destinationSectionId);

    if (!sourceSection || !destSection) return;

    const newSections = [...sections];
    const sourceIndex = newSections.findIndex(s => s.id === sourceSectionId);
    const destIndex = newSections.findIndex(s => s.id === destinationSectionId);

    if (sourceSectionId === destinationSectionId) {
      // Reordering within the same section
      const reorderedLessons = Array.from(sourceSection.lessons);
      const [removed] = reorderedLessons.splice(source.index, 1);
      reorderedLessons.splice(destination.index, 0, removed);

      // Update order property
      const updatedLessons = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index
      }));

      newSections[sourceIndex] = {
        ...sourceSection,
        lessons: updatedLessons
      };
    } else {
      // Moving between sections
      const [movedLesson] = sourceSection.lessons.splice(source.index, 1);
      destSection.lessons.splice(destination.index, 0, movedLesson);

      // Update order properties for both sections
      newSections[sourceIndex].lessons = sourceSection.lessons.map((lesson, index) => ({
        ...lesson,
        order: index
      }));
      newSections[destIndex].lessons = destSection.lessons.map((lesson, index) => ({
        ...lesson,
        order: index
      }));
    }

    setSections(newSections);
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="Section Title"
                              className="font-semibold"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection(section.id)}
                          >
                            {section.isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {section.isExpanded && (
                          <>
                            <Textarea
                              value={section.description || ''}
                              onChange={(e) => updateSection(section.id, { description: e.target.value })}
                              placeholder="Section Description"
                              className="mb-4"
                            />

                            <Droppable droppableId={`${section.id}-lessons`} type="lesson">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-2"
                                >
                                  {section.lessons.map((lesson, lessonIndex) => (
                                    <Draggable
                                      key={lesson.id}
                                      draggableId={lesson.id}
                                      index={lessonIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-secondary p-3 rounded-lg"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                              {lesson.type === 'VIDEO' ? (
                                                <Video className="h-5 w-5" />
                                              ) : (
                                                <FileText className="h-5 w-5" />
                                              )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                              <Input
                                                value={lesson.title}
                                                onChange={(e) =>
                                                  updateLesson(section.id, lesson.id, {
                                                    title: e.target.value,
                                                  })
                                                }
                                                placeholder="Lesson Title"
                                              />
                                              <div className="flex gap-2">
                                                <Select
                                                  value={lesson.type}
                                                  onValueChange={(value) =>
                                                    updateLesson(section.id, lesson.id, {
                                                      type: value as Lesson['type'],
                                                    })
                                                  }
                                                >
                                                  <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select type" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="VIDEO">Video</SelectItem>
                                                    <SelectItem value="READING">Reading</SelectItem>
                                                    <SelectItem value="QUIZ">Quiz</SelectItem>
                                                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                                <Input
                                                  type="number"
                                                  placeholder="Duration (min)"
                                                  value={lesson.duration || ''}
                                                  onChange={(e) =>
                                                    updateLesson(section.id, lesson.id, {
                                                      duration: parseInt(e.target.value) || 0,
                                                    })
                                                  }
                                                  className="w-32"
                                                />
                                              </div>
                                              {lesson.type === 'VIDEO' ? (
                                                <div className="space-y-4">
                                                  {lesson.videoUrl ? (
                                                    <div className="space-y-2">
                                                      <VideoPlayer url={lesson.videoUrl} />
                                                      <div className="flex justify-end">
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={() => updateLesson(section.id, lesson.id, {
                                                            videoUrl: undefined,
                                                            videoProvider: undefined,
                                                            videoThumbnail: undefined,
                                                            duration: undefined
                                                          })}
                                                        >
                                                          Change Video
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <VideoUpload
                                                      onVideoAdded={({ url, duration, thumbnail, provider }) => {
                                                        updateLesson(section.id, lesson.id, {
                                                          videoUrl: url,
                                                          duration,
                                                          videoThumbnail: thumbnail,
                                                          videoProvider: provider
                                                        });
                                                      }}
                                                    />
                                                  )}
                                                </div>
                                              ) : (
                                                <Textarea
                                                  value={lesson.content || ''}
                                                  onChange={(e) =>
                                                    updateLesson(section.id, lesson.id, {
                                                      content: e.target.value,
                                                    })
                                                  }
                                                  placeholder="Content"
                                                  className="mt-2"
                                                />
                                              )}
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeLesson(section.id, lesson.id)}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>

                            <Button
                              onClick={() => addLesson(section.id)}
                              variant="outline"
                              className="mt-4 w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button onClick={addSection} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>

      <Button onClick={() => onSave({ sections })} className="w-full bg-green-600 hover:bg-green-700">
        Save Curriculum
      </Button>
    </div>
  );
} 