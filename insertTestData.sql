-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 22, 2019 at 11:24 AM
-- Server version: 8.0.13-4
-- PHP Version: 7.2.19-0ubuntu0.18.04.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+12:00";

INSERT INTO `document` (`id`, `title`)
VALUES (1, 'test'),
       (2, 'asdf');

INSERT INTO `section` (`document_id`, `section_number`, `title`, `text`)
VALUES (1, 1, 'introduction',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia erat. Aenean faucibus ante vel turpis ullamcorper, a mollis odio luctus. Curabitur sit amet fermentum dui, in sagittis tortor. Sed ac nunc commodo, consectetur neque quis, pellentesque tellus. Sed vitae est egestas, vestibulum odio nec, tincidunt odio. Curabitur ac tortor sed massa placerat maximus. Nulla placerat massa vitae congue finibus.\r\n\r\nAliquam suscipit lacus eu orci mollis, eu pulvinar mi consequat. Vestibulum lacinia dolor in lectus lacinia, id varius est suscipit. Phasellus vitae convallis libero, sit amet sollicitudin justo. Quisque dignissim condimentum efficitur. Nunc lacinia dapibus mi, ut aliquam ipsum. Mauris cursus ornare dapibus. Vestibulum ultricies, elit eget iaculis vestibulum, nunc dui egestas massa, vitae faucibus lectus velit a enim. Curabitur sit amet interdum dui, vel ultrices diam. Aliquam lacus justo, ultrices sit amet nibh ut, dignissim facilisis ligula. Mauris mattis rutrum dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus commodo scelerisque ligula eu placerat. Pellentesque nisl nisi, mattis sed porttitor vel, tincidunt vitae leo. Maecenas quis consequat massa. Maecenas pellentesque tortor eu pulvinar aliquet.\r\n\r\nProin tincidunt nec risus vitae maximus. Maecenas ultrices elementum tempus. Sed euismod cursus nulla a vestibulum. Nunc congue quam commodo lacus pretium laoreet. Sed at lacus iaculis, pellentesque diam at, viverra est. Proin ultrices luctus porttitor. Fusce sagittis maximus elit, eu varius velit vestibulum eu. Fusce a nibh vel nulla sodales laoreet. Phasellus porta ornare lacus, vitae lacinia eros fringilla non. Suspendisse at elit ac diam facilisis consequat.'),
       (1, 2, 'conclusion',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed placerat urna. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam at nibh eget elit venenatis viverra dapibus et velit. Integer eget lobortis orci. Fusce neque eros, convallis non nisi id, venenatis sollicitudin neque. In lacinia eros a augue tempor ornare. Aenean quis odio vel mauris feugiat condimentum vitae at purus. Mauris blandit lobortis risus at finibus. Suspendisse eget dui elit. Aliquam pellentesque mattis tristique. Aenean sagittis commodo tortor, et tempor nulla cursus et. Curabitur sed porta dui. Maecenas dictum erat sit amet leo facilisis malesuada. Donec ultricies enim ut lobortis bibendum. Nam nec hendrerit enim. Integer odio massa, pretium sit amet scelerisque at, consectetur sed ipsum.\r\n\r\nVivamus pharetra leo a lectus bibendum semper. Duis libero tellus, congue a nulla non, congue molestie velit. Donec sed dolor dolor. Sed placerat, nibh in consectetur dictum, enim est convallis enim, at posuere elit leo id neque. Sed gravida nunc sed sollicitudin vulputate. Suspendisse accumsan venenatis nisl, et cursus dui. In sed ex ut turpis hendrerit dignissim. Nulla mattis est non eros ultricies, mattis placerat eros porttitor.\r\n\r\nCras consectetur magna lectus, sit amet bibendum dui rhoncus sit amet. Donec vestibulum nisi tortor, sed finibus felis pretium vel. In feugiat neque ut lorem fringilla, ac gravida lectus vulputate. Duis tincidunt varius dolor in fermentum. In hac habitasse platea dictumst. Pellentesque ligula risus, aliquam et placerat ut, semper sed ligula. In vitae nisl lobortis, aliquam mauris vel, egestas justo. Ut et egestas libero. Quisque efficitur nisl nisl, ac pretium dolor consectetur sed. Nullam at ante nec felis tempor posuere sed vitae mauris.');

INSERT INTO `annotation` (`document_id`, `section_number`, `start`, `end`, `tag`)
VALUES (1, 1, 5, 6, 'A PRIORI'),
       (1, 1, 48, 49, 'EMERGING'),
       (1, 1, 88, 97, 'RELATION'),
       (1, 1, 185, 186, 'A PRIORI'),
       (1, 2, 13, 14, 'FORWARD'),
       (1, 2, 128, 129, 'BACKWARD'),
       (1, 2, 46, 47, 'ENTITY');

COMMIT;
