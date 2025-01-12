import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
} from '@/components/ui';
import { COURSE_LEVELS } from '@/config/constants';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    search: string;
    category: string;
    level: string;
    type: string;
  };
  onFilterChange: (filters: {
    search: string;
    category: string;
    level: string;
    type: string;
  }) => void;
}

const COURSE_TYPES = [
  'All',
  'Self-paced',
  'Instructor-led',
  'Workshop',
  'Bootcamp'
];

const COURSE_CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'UI/UX Design'
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: FilterModalProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value });
  };

  const handleLevelChange = (value: string) => {
    onFilterChange({ ...filters, level: value });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({ ...filters, type: value });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: 'All',
      level: 'All',
      type: 'All'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Courses</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <RadioGroup
                value={filters.category}
                onValueChange={handleCategoryChange}
                className="space-y-2"
              >
                {COURSE_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={`category-${category}`} />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </RadioGroup>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <RadioGroup
              value={filters.level}
              onValueChange={handleLevelChange}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="level-all" />
                <Label htmlFor="level-all">All</Label>
              </div>
              {Object.values(COURSE_LEVELS).map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`level-${level}`} />
                  <Label htmlFor={`level-${level}`}>{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Course Type</Label>
            <RadioGroup
              value={filters.type}
              onValueChange={handleTypeChange}
              className="grid grid-cols-2 gap-2"
            >
              {COURSE_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 